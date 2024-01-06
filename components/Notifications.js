import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet, Image } from "react-native";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

const Notifications = ({ route }) => {
  const [notifications, setNotifications] = useState([]);
  const { session, setNewNotif } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    setNewNotif(false);
    async function loadNotifications() {
      const { data, error } = await supabase
        .from("Pending_Swaps")
        .select()
        .eq("user1_id", session.user.id);
      return data;
    }

    loadNotifications().then((res) => {
      setNotifications(res);
    });
  }, []);

  async function getNotifications(length) {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("user1_id", session.user.id);

    if (data.length > length) {
      setNewNotif(true);
    }

    return data;
  }

  const handlePostgresChanges = async () => {
    const length = notifications.length;
    const res = await getNotifications(length);
    setNotifications(res);
  };

  supabase
    .channel("Pending_Swaps")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Pending_Swaps" },
      handlePostgresChanges
    )
    .subscribe();

  return (
    <View>
      <Text>This is Notifications Screen</Text>
      <Pressable
        onPress={() => navigation.navigate("SwapNegotiationPage")}
        style={styles.button}
      >
        <Text>Swap Offer notification card</Text>
      </Pressable>
      {notifications.map((notification) => (
        <Pressable
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapOffer", { info: notification });
          }}
        >
          <View key={notification.offer_date}>
            <Text>
              {notification.user2_username} would like{" "}
              {notification.user1_book_title}
            </Text>
            <Image
              source={{ uri: notification.user1_book_imgurl }}
              style={styles.image}
            />
            <Text></Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    borderColor: "gray",
    borderWidth: 2,
    width: "auto",
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
});

export default Notifications;
