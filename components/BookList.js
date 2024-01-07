import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import supabase from "../config/supabaseClient";

import BookListCard from "./BookListCard";

const screenWidth = Dimensions.get("window").width;

export default function BookList({ categoryName, id }) {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    async function getBooks(categoryName) {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("Category", categoryName);
      setBookList(data);
    }

    getBooks(categoryName);
  }, []);

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryHeader}>{categoryName}</Text>
        <Pressable>
          <Text>See More</Text>
        </Pressable>
      </View>
      <View style={styles.categoryList}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {bookList.map((listing) => {
            return <BookListCard listing={listing} key={listing.book_id} id={id} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: "center",
    flex: 1,
  },
  categoryHeader: {
    flexDirection: "row",
    flex: 1,
    width: screenWidth * 0.9,
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryList: {
    width: screenWidth,
    flexDirection: "row",
    marginTop: 10,
  },
});
