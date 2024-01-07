import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, StyleSheet, View, Image } from "react-native";

export default function SwapOffer({ route }) {
  const { info } = route.params;
  const navigation = useNavigation();

  return (
    <View>
      <Text>This is the page for a swap offer</Text>
      <Pressable>
        <Text>Go to chat button</Text>
      </Pressable>
      <View style={styles.wrappingContainer}>
        <View style={styles.container}>
          <Text>{info.user1_book_title}</Text>
          <Image
            source={{ uri: info.user1_book_imgurl }}
            style={styles.image}
          />
        </View>
        <View style={styles.container}>
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
  wrappingContainer: {
    display: "flex",
    flexDirection: "column",
  },
  container: {
    margin: "auto",
    borderColor: "gray",
    borderWidth: 2,
    alignItems: "center",
    width: "80%",
    borderRadius: 12,
  },
  image: {
    margin: "auto",
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 4,
    resizeMode: "contain",
  },
  pick_book: {
    marginTop: 60,
    height: 80,
  },
});
