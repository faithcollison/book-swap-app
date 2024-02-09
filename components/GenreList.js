import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

import supabase from "../config/supabaseClient";
import { BookListCard } from "./index";

const { width } = Dimensions.get("screen");

export function GenreList({ route }) {
  const { genre } = route.params;
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    async function getBooksByGenre(genre) {
      const { data, error } = await supabase
        .from("Listings")
        .select()
        .eq("Category", genre);
      setGenreList(data);
    }
    getBooksByGenre(genre);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{genre} Books</Text>
      <View style={styles.bookList}>
        {genreList.map((listing) => {
          return (
            <View style={styles.bookContainer} key={listing.book_id}>
              <View style={styles.book}>
                <BookListCard listing={listing} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 28,
    fontWeight: "bold",
    margin: 16,
    color: "white",
  },
  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  bookList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bookContainer: {
    width: width / 3,
    height: 190,
  },
  book: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
