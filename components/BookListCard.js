import { StyleSheet, View, Image, Pressable } from "react-native";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export default function BookListCard({ listing, id }) {
  const [wishListed, setWishListed] = useState(false);
  const navigation = useNavigation();

  function handleWishListButton(listing) {
    async function updateWishList(num) {
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("listing_id", listing.listing_id);
    }

    async function getUserWishList() {
      const { data, error } = await supabase
        .from("Users")
        .select("wishlist")
        .eq("user_id", id);
      return data[0].wishlist;
    }

    async function updateUserWishList(res) {
      if (res.includes(listing.book_title)) {
        return;
      }
      const sendArray =
        res.length === 0 ? [listing.book_title] : [...res, listing.book_title];

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: sendArray })
        .eq("user_id", id);
    }

    async function removeItemFromWishList(res) {
      const sendArray = res.filter((item) => item !== listing.book_title);

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: sendArray })
        .eq("user_id", id);
    }

    if (!wishListed) {
      setWishListed(true);
      updateWishList(1);
      getUserWishList().then((res) => {
        updateUserWishList(res);
      });
    } else {
      setWishListed(false);
      updateWishList(0);
      getUserWishList().then((res) => {
        removeItemFromWishList(res);
      });
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
