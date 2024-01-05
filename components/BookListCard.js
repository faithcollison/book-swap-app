import { StyleSheet, View, Image, Pressable } from "react-native";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export default function BookListCard({ listing }) {
  // function to add books to user wish list
  // const session = supabase.auth.getSession()
  //     .then(session => {
  //     })
  // console.log(session, '<<<<<')

  const [wishListed, setWishListed] = useState(false);
  const navigation = useNavigation();

  function handleWishListButton(listing) {
    async function updateWishList(num) {
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("listing_id", listing.listing_id);
    }

    // async function updateWishList(user_id)

    if (!wishListed) {
      setWishListed(true);
      updateWishList(1);
    } else {
      setWishListed(false);
      updateWishList(0);
    }
  }

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={() => navigation.navigate("SingleBookListings")}>
        <Image style={styles.bookCard} source={{ uri: listing.img_url }} />
      </Pressable>
      <Pressable
        style={styles.heartContainer}
        onPress={() => handleWishListButton(listing)}
      >
        <FontAwesome
          name="circle"
          size={37}
          color="white"
          style={{ opacity: 0.8 }}
        />
        {!wishListed ? (
          <AntDesign
            name="hearto"
            size={18}
            color="maroon"
            style={styles.heart}
          />
        ) : (
          <AntDesign
            name="heart"
            size={18}
            color="maroon"
            style={styles.heart}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    height: 150,
    resizeMode: "contain",
  },
  cardContainer: {
    flex: 1,
    width: ScreenWidth / 3,
    padding: 5,
    justifyContent: "center",
  },
  heartContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    position: "absolute",
  },
});
