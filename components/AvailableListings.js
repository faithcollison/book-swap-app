import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import ListedBook from "./ListedBook";
const api = process.env.GOOGLE_BOOKS_API_KEY;

export default function AvailableListings({ route }) {
  const navigation = useNavigation();
  const { session, listing } = route.params;
  const [listings, setListings] = useState([]);
  const [userName, setUserName] = useState("");
  const [bookInfo, setBookInfo] = useState({});
  const googleID = route.params.listing.google_book_id;

  useEffect(() => {
    async function getBookInfo() {
      // if googlebooks ID exists, will find info from API
      if (googleID) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${googleID}?key=${api}`
          );
          const data = await response.json();
          setBookInfo(data.volumeInfo);
        } catch (error) {
          console.error(error);
        }
      }
    }
    async function getAllListings() {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("book_title", listing.book_title);
      setListings(data);
    }
    async function getBookOwner() {
      const { data, error } = await supabase
        .from("Users")
        .select("username")
        .eq("user_id", listing.user_id);
      setUserName(data[0].username);
    }
    getBookInfo();
    getAllListings();
    getBookOwner();
  }, []);
  // remove <p> and <br> from description
  const blurb = bookInfo.description;
  let newBlurb;
  if (blurb) {
    const regex = /<\/?[^>]+>/g;
    newBlurb = blurb.replace(regex, "");
  }

  return (
    <View>
      <View>
        <Image style={styles.bookCard} source={{ uri: listing.img_url }} />
        {Object.keys(bookInfo).length > 0 ? (
          <>
            <Text> {bookInfo.title}</Text>
            <Text> Written by {bookInfo.authors}</Text>
            <Text> Released on {bookInfo.publishedDate}</Text>
            <Text> About: {newBlurb}</Text>
          </>
        ) : (
          <Text> No information available </Text>
        )}
      </View>

      <Text>Books listed by users:</Text>
      <ScrollView>
        {listings.map((book) => {
          const date = book.date_posted;
          const newDate = date.split("T")[0];
          return (
            <View key={book.book_id}>
              <TouchableOpacity>
                <View style={styles.item}>
                  <Text> Posted on : {newDate}</Text>
                  <Text> User: {userName}</Text>
                  <Text> User Rating: </Text>
                  <Text> Condition: {book.condition} </Text>
                  <Pressable
                    onPress={() => {
                      handleSwapRequest(book);
                    }}
                    style={styles.button}
                  >
                    <ListedBook route={{session: session, listing: book}}/>
                  </Pressable>
                </View>
              </TouchableOpacity>
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
  item: {
    borderColor: "black",
    borderWidth: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
});
