import { Text, StyleSheet, Pressable, View } from "react-native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

export default function ListedBook({ route, username }) {
  const navigation = useNavigation();
  const { session, listing } = route;
  const [swapState, setSwapState] = useState(false);
  const [swapRequestMade, setSwapRequestMade] = useState(false);



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
      {/* <Text>{listing.listing_id}</Text> */}
      <Pressable
        // style={styles.descriptionButton}
        onPress={() => {
          Promise.all([checkSwapExists(), reqSwap()]).then(
            ([checkResults, reqResults]) => {
              sendNotification(reqResults);
            }
          );
          setSwapRequestMade(true)
        }}
        style={styles.descriptionButton}
       
      >
        <View >
          <Text  style={swapRequestMade ? styles.requestSwapButtonPressed : styles.text}> {swapRequestMade? "Request Made": "Request swap"}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
  descriptionButton: {
    backgroundColor: "#3B8D77",
    fontSize: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.33,
    borderRadius: 15,
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  requestSwapButtonPressed: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "black",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  
});
