import { Text, StyleSheet, Pressable, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function AvailableListings({route}) {
  const navigation = useNavigation();
  const { session, listing } = route.params
  

  return (
    <View>
      <Image style={styles.bookCard} source={{ uri: listing.img_url }} />
      <Pressable
        onPress={() => {
          navigation.navigate("ListedBook",
          {listing: listing})
        }}
        style={styles.button}
      >
        <Text>This button takes you to an individual book page to make an offer.</Text>
      </Pressable>
      <Text>
        This is going to be a list of cards, each card will be a link to an
        individual book page
      </Text>
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
