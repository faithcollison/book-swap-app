import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, StyleSheet, View, Image, Dimensions } from "react-native";
import { ScreenWidth } from "react-native-elements/dist/helpers";

export default function SwapOffer({ route }) {
  const { info } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      <View style={styles.bookAndProfilePics}>
        <View style={styles.bookContainer}>
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
    flex: 1,
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
    width: ScreenWidth*0.8,
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
