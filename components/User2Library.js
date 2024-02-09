import { useCallback, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  RefreshControl,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import supabase from "../config/supabaseClient";

export function User2LibraryPage({ route }) {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { info, session } = route.params;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("Listings")
      .select("*")
      .eq("user_id", info.user2_id)
      .order("date_posted", { ascending: false });

    if (error) {
      alert(error);
    } else {
      setBooks(data);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    async function getListings() {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("user_id", info.user2_id)
        .order("date_posted", { ascending: false });

      if (error) {
        alert(error);
      } else {
        setBooks(data);
      }
    }

    getListings();
  }, []);

  async function updateSwapInfo(book) {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .update({
        user2_book_title: book.book_title,
        user2_book_imgurl: book.img_url,
        user2_listing_id: book.book_id,
      })
      .select("pending_swap_id")
      .eq("user1_id", session.user.id)
      .eq("user2_id", book.user_id);

    if (error) {
      console.log(error);
    }
    return data[0];
  }

  async function sendNotification(bookInfo, swapId) {
    const { data, error } = await supabase.from("Notifications").insert([
      {
        swap_offer_id: swapId.pending_swap_id,
        type: "Chosen_Book",
        user_id: bookInfo.user_id,
        username: session.user.user_metadata.username,
      },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.headerText}>{info.user2_username}'s Library</Text>
      {books.map((book) => (
        <View key={book.book_id} style={styles.bookContainer}>
          <Text style={styles.titleText}>{book.book_title}</Text>
          <Text style={styles.authorText}>{book.author}</Text>
          <Image source={{ uri: book.img_url }} style={styles.image} />
          <Text style={styles.descriptionText}>{book.description}</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("SwapNegotiationPage", {
                user1_book: info,
                user2_book_url: book.img_url,
                info: info,
                user2_book_info: book,
              });
              updateSwapInfo(book).then((res) => {
                sendNotification(book, res);
              });
            }}
          >
            <Text style={styles.buttonContainer}>Choose book</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: Dimensions.get("window").height * 0.09,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookContainer: {
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#e3e3e3",
    padding: 16,
    borderRadius: 8,
    width: Dimensions.get("window").width - 32,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  authorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    alignItems: "center",
    width: "50%",
    height: 290,
    marginBottom: 8,
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 12,
    padding: 3,
  },
});
