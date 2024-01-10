import { Text, StyleSheet, Pressable, View } from "react-native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ListedBook({ route, username }) {
  const navigation = useNavigation();
  const { session, listing } = route;
  const [swapState, setSwapState] = useState(false);


  async function checkSwapExists() {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("user1_id", listing.user_id)
      .eq("user2_id", session.user.id)
      .eq("user1_listing_id", listing.book_id);

    if (data.length > 0) {
      setSwapState(true);
    } else {
      setSwapState(false);
    }
  }

  // inserts info into pending swaps
  const reqSwap = async () => {
    if (swapState) {
      return;
    }
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .insert([
        {
          user1_id: listing.user_id,
          user1_book_title: listing.book_title,
          user1_listing_id: listing.book_id,
          user1_book_imgurl: listing.img_url,
          user1_username: username,
          user2_id: session.user.id,
          user2_username: session.user.user_metadata.username,
        },
      ])
      .select("pending_swap_id");

    if (error) {
      console.error("Failed to make swap request: ", error);
    } else {
      console.log("Data inserted: ", data);
    }
    setSwapState(true);
    return data[0].pending_swap_id;
  };

  const sendNotification = async (id) => {
    if (swapState) {
      return;
    }
    const { data, error } = await supabase.from("Notifications").insert([
      {
        swap_offer_id: id,
        type: "Swap_Request",
        user_id: listing.user_id,
      },
    ]);
  };

  return (
    <View>
      <Text>{listing.listing_id}</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          Promise.all([checkSwapExists(), reqSwap()]).then(
            ([checkResults, reqResults]) => {
              sendNotification(reqResults);
            }
          );
        }}
      >
        <Text>Button to request swap</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
});
