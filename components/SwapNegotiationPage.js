import { Text, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import supabase from "../config/supabaseClient";

export default function SwapNegotiationPage({ route }) {
  const navigation = useNavigation();

  const { user1_book, user2_book } = route.params;

  // console.log(user1_book, user2_book);

  // Accept - Transfer row from pending swaps to swap history
  //          Delete all rows from pending swaps with matching book id's(listing id)
  //          Delete books from listings page with matching book id's

  // Reconsider - Takes you to opposing users library where you can change your book choice

  // Reject - Remove row from pending swaps with matching book id
  //          Deletes notification for user 1 (book holder)
  //          Sends notification to user 2 notifying they have been rejected

  async function getTransferData() {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("pending_swap_id", user1_book.pending_swap_id);

    return data[0];
  }

  async function updateSwapHistory(info) {
    const { data, error } = await supabase.from("Swap_History").insert([info]);
  }

  async function removeData(info) {
    await Promise.all([
      supabase
        .from("Pending_Swaps")
        .delete()
        .eq("pending_swap_id", info.pending_swap_id),
      supabase.from("Listings").delete().eq("book_id", info.user1_listing_id),
      supabase.from("Listings").delete().eq("book_id", info.user2_listing_id),
    ]);
  }

  return (
    <View>
      <Text>This is the swap negotiation page</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            getTransferData()
              .then((res) => {
                updateSwapHistory(res);
                return res;
              })
              .then((res) => {
                removeData(res);
              }).then(() => {
                navigation.navigate('Home')
              })
          }}
        >
          <Text style={styles.button}>Accept</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.button}>Reconsider</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.button}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    margin: "auto",
  },
  button: {
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 12,
    margin: 10,
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
