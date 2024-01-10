import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, StyleSheet, View, Image, Dimensions } from "react-native";
import { ScreenWidth, ScreenHeight } from "react-native-elements/dist/helpers";
import { useState, useEffect } from "react";

export default function SwapOffer({ route }) {
  const { info, session } = route.params;
  const navigation = useNavigation();
  const [user1Profile, setUser1Profile] = useState()
  const [user2Profile, setUser2Profile] = useState()


  // MVP ONLY - NEEDS REFACTORING TO BE SCALABLE 
  useEffect(() => {
    switch (info.user1_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Nav.jpg'));
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Jake.jpg'));
        break;
      case "c563d513-b021-42f2-a3b3-77067b8547af": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Jay.jpg'));
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Ana.jpg'));
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Alicia.jpg'));
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b": 
        setUser1Profile(require('../assets/ExampleUserProfilePictures/Faith.jpg'));
        break;
    }
  }, [info.user1_id]);
  
  useEffect(() => {
    switch (info.user2_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Nav.jpg'));
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Jake.jpg'));
        break;
        case "c563d513-b021-42f2-a3b3-77067b8547af": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Jay.jpg'));
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Ana.jpg'));
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Alicia.jpg'));
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b": 
        setUser2Profile(require('../assets/ExampleUserProfilePictures/Faith.jpg'));
        break;
    }
  }, [info.user2_id]);

  return (
    <View style={styles.page}>
      <View style={styles.bookAndProfilePics}>
        <View style={styles.bookContainer}>
          <Image
            source={user1Profile}
            style={styles.bookCard}
            />
          <Image
            source={{ uri: info.user1_book_imgurl }}
            style={styles.bookCard}
            />
        </View>
        <View style={styles.bookContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate("User2Library", { info: info });
            }}
            >
            <Text style={styles.pick_book}>
              Select a book from {info.user2_username}'s library
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
  bookAndProfilePics: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "gray",
    borderWidth: 2,
    width: ScreenWidth*0.9,
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
  bookCard: {
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "contain",
  },
});
