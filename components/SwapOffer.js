import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, StyleSheet, View, Image, Dimensions } from "react-native";
import { ScreenWidth, ScreenHeight, color } from "react-native-elements/dist/helpers";
import { useState, useEffect } from "react";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";

export default function SwapOffer({ route }) {
  const { info, session, notification } = route.params;
  const navigation = useNavigation();
  const [user1ProfilePic, setUser1ProfilePic] = useState()
  const [user2ProfilePic, setUser2ProfilePic] = useState()

  console.log(info, notification)

  // MVP ONLY - NEEDS REFACTORING TO BE SCALABLE! 
  useEffect(() => {
    switch (session.user.id) {
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
  }, []);
  
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
  }, []);

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
      <View>
        <Text style={styles.heading}>
          Your Offer
        </Text>
      </View>
      <View style={styles.booksAndProfilePics}>
        <View  style={styles.profilePics}>
          <View style={styles.picAndName}>
            <Image
              source={user1ProfilePic}
              style={styles.user1Profile}
              />
            <Text style={styles.body} >
              {session.user.user_metadata.username}
            </Text>
          </View>
          <Ionicons
					name="chatbubbles-outline"
					size={60}
					style={styles.icon}
					onPress={() => {
            navigation.navigate("ChatWindow", {
              sender: info.user1_id,
              receiver: info.user2_id,
              username: info.user2_username,
              session: session
            });
          }}
				  />
          <View style={styles.picAndName}>
            <Image
              source={user2ProfilePic}
              style={styles.user2Profile}
              />
            <Text style={styles.body} >
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
          <Pressable style={styles.pick_book}
            onPress={() => {
              navigation.navigate("User2Library", { info: info });
            }}
            >
            <Text style={styles.body}>
              Select a book
            </Text>
          </Pressable>
        </View>
        <View style={styles.buttons}>
          <Pressable style={styles.reject} onPress={() => {
            getTransferData().then((res) => {
              rejectBook(res);
            });
          }}>
            <Text style={styles.body}>
              Reject Offer
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: JosefinSans_400Regular,
    color: "white",
  },
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
  body: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontFamily: JosefinSans_400Regular,
    color: "white",
  },
  icon: {
    color: "#4B7095",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  reject: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 120,
    backgroundColor: "#C1514B",
    borderRadius: 16.5,
  }
});
