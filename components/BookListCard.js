import { useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import supabase from "../config/supabaseClient";

export function BookListCard({ listing, id }) {
  const [wishListed, setWishListed] = useState(false);
  const navigation = useNavigation();

  function handleWishListButton(listing) {
    async function updateWishList(num) {
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("book_id", listing.book_id);
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
      const updatedWishlist = [...res, listing.book_title];
      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }
    async function removeItemFromWishList(res) {
      const updatedWishlist = res.filter((item) => item !== listing.book_title);
      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
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
      <Pressable
        onPress={() =>
          navigation.navigate("AvailableListings", { listing: listing })
        }
      >
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
          style={{ opacity: 0.9 }}
        />
        {!wishListed ? (
          <AntDesign
            name="hearto"
            size={18}
            color="#C1514B"
            style={styles.heart}
          />
        ) : (
          <AntDesign
            name="heart"
            size={18}
            color="#C1514B"
            style={styles.heart}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "cover",
  },
  cardContainer: {
    flex: 1,
    width: ScreenWidth / 3,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  heartContainer: {
    position: "absolute",
    top: 8.5,
    right: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    position: "absolute",
  },
});
