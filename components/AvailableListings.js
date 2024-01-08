import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

export default function AvailableListings({ route }) {
  const navigation = useNavigation();
  const { session, listing } = route.params;
  const [listings, setListings] = useState([]);
  // console.log(listing.book_title)
  useEffect(() => {
    async function getAllListings() {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("book_title", listing.book_title);
        // console.log(data)
      setListings(data);
    }
    getAllListings();
  }, []);
// console.log(listings, "listings")
  return (
    <View>
      <Image style={styles.bookCard} source={{ uri: listing.img_url }} />
      <Pressable
        onPress={() => {
          navigation.navigate("ListedBook", { listing: listing });
        }}
        style={styles.button}
      >
        <Text>
          This button takes you to an individual book page to make an offer.
        </Text>
      </Pressable>
      <Text>
        This is going to be a list of cards, each card will be a link to an
        individual book page
      </Text>
      <ScrollView>
        {listings.map((book) => {
          // console.log(book)
          return (
            <View key={book.id}>
              <Image style={[styles.image, { width: 100, height: 100 }]} source={book.img_url}/>
              <Text> {book.book_title}</Text>
              <Text> {book.user_id}</Text>
              
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
  bookCard: {
    height: 150,
    resizeMode: "contain",
  },
});
