import { React, useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

import supabase from "../config/supabaseClient";

export const WishList = ({ session }) => {
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (session) {
      getWishList();
      setUsername(session?.user?.user_metadata?.username);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getWishList(username);
    setRefreshing(false);
  }, [username]);

  const getWishList = async () => {
    const { data, error } = await supabase
      .from("Users")
      .select("wishlist")
      .eq("user_id", session.user.id)
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    const wishlist = data?.wishlist || [];
    const promises = wishlist.map(async (book) => {
      const { data, error } = await supabase
        .from("Listings")
        .select("img_url")
        .eq("book_title", book)
        .limit(1)
        .single();

      if (error) {
        console.log(error);
        return null;
      }

      return { book, img_url: data?.img_url };
    });

    const booksWithImages = await Promise.all(promises);
    setBooks(booksWithImages.filter((item) => item !== null));
  };

  const removeFromWishList = async (book) => {
    const { data, error } = await supabase
      .from("Users")
      .update({ wishlist: books.filter((item) => item.book !== book) })
      .select("wishlist")
      .eq("user_id", session.user.id);

    if (error) {
      console.log(error);
    } else {
      setBooks(data[0].wishlist);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Text style={styles.headerText}>Your Wishlist:</Text>
        {books.map(({ book, img_url }) => (
          <View key={book} style={styles.listContainer}>
            <Entypo
              name="circle-with-cross"
              size={20}
              style={styles.icon}
              onPress={() => removeFromWishList(book)}
            />
            <View style={styles.itemContainer}>
              {img_url && (
                <Image source={{ uri: img_url }} style={styles.bookImage} />
              )}
              <Text style={[styles.textStyling]}>{book}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    padding: 16,
  },
  headerText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  listContainer: {
    display: "flex",
    backgroundColor: "#06A77D",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 8,
    padding: 10,
    posistion: "relative",
  },
  textStyling: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    flexShrink: 1,
  },
  icon: {
    color: "white",
    position: "absolute",
    right: 10,
    top: 5,
    zIndex: 1,
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    borderRadius: 7,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
