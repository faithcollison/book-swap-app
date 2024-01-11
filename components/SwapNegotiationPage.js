import { Text, StyleSheet, Pressable, View, Dimensions, Image } from "react-native";
import { ScreenWidth, ScreenHeight, color } from "react-native-elements/dist/helpers";
import { useNavigation } from "@react-navigation/native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { Entypo, Ionicons } from '@expo/vector-icons';

export default function SwapNegotiationPage({ route }) {
  const [title, setTitle] = useState([]);
  const navigation = useNavigation();
  const [user1ProfilePic, setUser1ProfilePic] = useState()
  const [user2ProfilePic, setUser2ProfilePic] = useState()

  const { user1_book, user2_book, info, session } = route.params;

  // MVP ONLY - NEEDS REFACTORING TO BE SCALABLE! 
  useEffect(() => {
    switch (info.user1_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Nav.jpg'));
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Jake.jpg'));
        break;
      case "c563d513-b021-42f2-a3b3-77067b8547af": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Jay.jpg'));
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Ana.jpg'));
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Alicia.jpg'));
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b": 
        setUser1ProfilePic(require('../assets/ExampleUserProfilePictures/Faith.jpg'));
        break;
    }
  }, [info.user1_id]);
  
  useEffect(() => {
    switch (info.user2_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Nav.jpg'));
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Jake.jpg'));
        break;
        case "c563d513-b021-42f2-a3b3-77067b8547af": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Jay.jpg'));
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Ana.jpg'));
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Alicia.jpg'));
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b": 
        setUser2ProfilePic(require('../assets/ExampleUserProfilePictures/Faith.jpg'));
        break;
    }
  }, [info.user2_id]);

  useEffect(() => {
    getTransferData().then((res) => {
      setTitle([`${res.user1_book_title}`, `${res.user2_book_title}`]);
    });
  });

  async function getTransferData() {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq(
        "pending_swap_id",
        user1_book ? user1_book.pending_swap_id : info.swap_offer_id
      );

    return data[0];
  }

  async function updateSwapHistory(info) {
    const { data, error } = await supabase.from("Swap_History").insert([info]);
  }

  async function removeData(infoResponse) {
    console.log(infoResponse);
    await Promise.all([
      supabase
        .from("Pending_Swaps")
        .delete()
        .eq("pending_swap_id", infoResponse.pending_swap_id),
      supabase
        .from("Listings")
        .delete()
        .eq("book_id", infoResponse.user1_listing_id),
      supabase
        .from("Listings")
        .delete()
        .eq("book_id", infoResponse.user2_listing_id),
    ]);
  }

  async function rejectBook(info) {
    await Promise.all([
      supabase.from("Notifications").insert([
        {
          type: "Offer_Rejected",
          user_id:
            info.user1_id === session.user.id ? info.user2_id : info.user1_id,
          username: session.user.user_metadata.username,
        },
      ]),
      supabase
        .from("Notifications")
        .delete()
        .eq("swap_offer_id", info.pending_swap_id),
      supabase
        .from("Pending_Swaps")
        .delete()
        .eq("pending_swap_id", info.pending_swap_id),
    ]);
  }

  return (
    <View style={styles.page}>
      <View style={styles.booksAndProfilePics}>
        <View  style={styles.profilePics}>
          <View style={styles.picAndName}>
            <Image
              source={user1ProfilePic}
              style={styles.user1Profile}
              />
            <Text style={styles.profileName} >
              {info.user1_username}
            </Text>
          </View>
          <Ionicons
					name="chatbubbles-outline"
					size={60}
					style={styles.icon}
					onPress={() => {
                      navigation.navigate("ChatWindow", {
                        sender: user1_book ? user1_book.user1_id : info.swapData.user_id,
                        receiver: user1_book ? user1_book.user2_id : info.user_id,
                        username: user1_book ? user1_book.user2_username : info.username,
                        session: session
                      });
                    }}
				  />
          <View style={styles.picAndName}>
            <Image
              source={user2ProfilePic}
              style={styles.user2Profile}
              />
            <Text style={styles.profileName} >
              {info.user2_username}
            </Text>
          </View>
        </View>
        <View style={styles.booksAndArrows}>
          <Image
            source={{ uri: info.user1_book_imgurl }}
            style={styles.bookCard}
            />
            <Text style={styles.arrows}>
            <Entypo name="arrow-long-right" size={60} color="#C1514B" />
            <Entypo name="arrow-long-left" size={60} color="#06A77D" />
            </Text>
            <Image
            source={{ uri: info.user2_book_imgurl }}
            style={styles.bookCard}
            />
        </View>
        <View style={styles.buttons}>
          <Pressable style={styles.accept}
            onPress={() => {
              getTransferData()
                .then((res) => {
                  updateSwapHistory(res);
                  return res;
                })
                .then((res) => {
                  removeData(res);
                })
                .then(() => {
                  navigation.navigate("Home");
                });
            }}
          >
            <Text style={{color: "white"}}>Accept</Text>
          </Pressable>
          <Pressable style={styles.reconsider}
            onPress={() => {
              getTransferData().then((res) => {
                navigation.navigate("ReconsiderLibrary", { info: res });
              });
            }}
          >
            <Text style={{color: "white"}}>Reconsider</Text>
          </Pressable>
          <Pressable style={styles.reject} onPress={() => {
            getTransferData().then((res) => {
              rejectBook(res);
            });
          }}>
            <Text style={{color: "white"}}>
              Reject Offer
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  page: {
    backgroundColor: "#272727",
    flex: 0.91,
    alignItems: "center",
    justifyContent: "center",
  },
  booksAndProfilePics: {
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    // borderColor: "gray",
    // borderWidth: 5,
    width: ScreenWidth*0.9,
    height: 600,
  },
  profilePics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  booksAndArrows: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookContainer: {
    margin: 0,
    borderColor: "gray",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    width: 120,
    borderRadius: 16,
  },
  user1Profile: {
    borderRadius: 60,
    height: 120,
    width: 120,
    resizeMode: "cover",
    borderColor: "#C1514B",
    borderWidth: 3,
  },
  user2Profile: {
    borderRadius: 60,
    height: 120,
    width: 120,
    resizeMode: "cover",
    borderColor: "#06A77D",
    borderWidth: 3,
  },
  bookCard: {
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "contain",
  },
  pick_book: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#06A77D",
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "contain",
  },
  arrows: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  picAndName: {
    justifyContent: "center",
  },
  profileName: {
    paddingTop: 5,
    textAlign: "center",
    color: "white",
  },
  icon: {
    color: "#4B7095",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accept: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#06A77D",
    borderRadius: 16.5,
  },
  reconsider: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#4B7095",
    borderRadius: 16.5,
  },
  reject: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#C1514B",
    borderRadius: 16.5,
  }
});
