import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import ListedBook from "./ListedBook";
import Collapsible from "react-native-collapsible";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import Modal from "react-native-modal";
import { Dimensions } from "react-native";
import {
  VollkornSC_400Regular,
  Bellefair_400Regular,
  CormorantGaramond_400Regular,
  Lora_400Regular,
  JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
const screenHeight = Dimensions.get("window").height;
const api = process.env.GOOGLE_BOOKS_API_KEY;

export default function AvailableListings({ route }) {
  const navigation = useNavigation();
  const { session, listing } = route.params;
  const [listings, setListings] = useState([]);
  const [userName, setUserName] = useState("");
  const [bookInfo, setBookInfo] = useState({});
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swapRequestMade, setSwapRequestMade] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

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
    <View
      style={
        Platform.OS === "web"
          ? { ...styles.container, ...styles.webFix }
          : styles.container
      }
    >
      <View style={styles.halfPage}>
        <View style={styles.bookInfoBox}>
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              height: "100%",
              marginBottom: 25,
            }}
          >
            <Text style={styles.title}> {bookInfo.title}</Text>
            <View style={styles.bookCardContainer}>
              <Image
                style={styles.bookCard}
                source={{ uri: listing.img_url }}
              />
            </View>
            {Object.keys(bookInfo).length > 0 ? (
              <View>
                <Text style={styles.author}> {bookInfo.authors}</Text>
                <Text style={styles.text}>
                  Released on {bookInfo.publishedDate}
                </Text>
                <Pressable
                  onPress={() => setIsModalVisible(true)}
                  style={styles.descriptionButton}
                >
                  <Text style={styles.text}>About</Text>
                </Pressable>

                <Modal isVisible={isModalVisible} backdropOpacity={2}>
                  <View style={styles.modal}>
                    {/* <ScrollView> */}
                      <View
                        style={{ flexDirection: "column", alignItems: "left" }}
                      >
                        <Text style={styles.text}>{newBlurb}</Text>
                        <View>
                          <Pressable
                            onPress={() => setIsModalVisible(false)}
                            style={styles.closeButton}
                          >
                            <Text style={styles.text}>Close</Text>
                          </Pressable>
                        </View>
                      </View>
                    {/* </ScrollView> */}
                  </View>
                </Modal>
              </View>
            ) : (
              <Text style={styles.text}> No information available </Text>
            )}
          </LinearGradient>
        </View>
      </View>

      <View style={[styles.halfPage, {marginTop: 30}]}>
        <Text style={styles.title}>Books listed by users:</Text>
        <FlatList
          data={listings}
          keyExtractor={(item) => item.book_id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.text}>
                {" "}
                Posted by {userName} on{" "}
                {new Date(item.date_posted).toLocaleDateString()}{" "}
              </Text>
              <Text style={styles.text}> Condition is {item.condition} </Text>
              <Pressable style={styles.descriptionButton}>
                <ListedBook
                  username={userName}
                  route={{ session: session, listing: item }}
                />
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  webFix: {
    marginBottom: screenHeight * 0.09,
  },
  halfPage: {
    flex: 1,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    padding: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  author: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    padding: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    // position: "absolute",
    top: 60,
    right: 10,
    borderRadius: 50,
    padding: 10,
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
  bookInfoBox: {
    borderColor: "white",
    borderRadius: 30,
    borderWidth: 3,
    margin: 15,
  },
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
  bookCardContainer: {
    borderRadius: 50,
    overflow: "hidden",
  },
  bookCard: {
    height: 150,
    resizeMode: "contain",
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
  item: {
    borderColor: "black",
    borderWidth: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  listItem: {
    borderTopWidth: 1,
    borderBlockColor: "white",
    paddingTop: 10,
  },
});
