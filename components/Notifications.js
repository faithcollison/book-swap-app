import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

const Notifications = ({ route }) => {
  const [notifications, setNotifications] = useState([]);
  const { session, setNewNotif } = route.params;
  const [processedNotifications, setProcessedNotifications] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setNewNotif(false);
    async function loadNotifications() {
      const { data, error } = await supabase
        .from("Notifications")
        .select()
        .eq("user_id", session.user.id);
      return data;
    }

    loadNotifications().then((res) => {
      setNotifications(res);
    });
  }, []);

  async function getNotifications(length) {
    const { data, error } = await supabase
      .from("Notifications")
      .select()
      .eq("user_id", session.user.id);

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

  const getSwapInfo = async (id) => {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("pending_swap_id", id);

    return data[0];
  };

  const getUserInfo = async (id) => {
    const { data, error } = await supabase
      .from("Users")
      .select()
      .eq("user_id", id);

    return data[0];
  };

  supabase
    .channel("Notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Notifications" },
      handlePostgresChanges
    )
    .subscribe();

  useEffect(() => {
    Promise.all(
      notifications.map(async (notification) => {
        switch (notification.type) {
          case "Swap_Request":
            if (notification.swap_offer_id) {
              const swapData = await getSwapInfo(notification.swap_offer_id);
              return {
                ...notification,
                swapData,
              };
            }
            break;
          case "Chosen_Book":
            if (notification.user_id) {
              const swapData = await getUserInfo(notification.user_id);
              return {
                ...notification,
                swapData,
              };
            }
            break;
          default:
            return notification;
        }
      })
    ).then((newNotifications) => {
      setProcessedNotifications(newNotifications);
    });
  }, [notifications]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>This is Notifications Screen</Text>
        <Pressable
          onPress={() => navigation.navigate("SwapNegotiationPage")}
          style={styles.button}
        >
          <Text>Swap Offer notification card</Text>
        </Pressable>
      </View>
      <View style={{ justifyContent: "flex-start" }}>
        {processedNotifications.map((notification) => {
          switch (notification.type) {
            case "Swap_Request":
              if (notification.swapData) {
                return (
                  <Pressable
                    style={styles.container}
                    onPress={() => {
                      navigation.navigate("SwapOffer", {
                        info: notification.swapData,
                      });
                    }}
                  >
                    <View key={notification.swapData.offer_date}>
                      <Text>
                        {notification.swapData.user2_username} would like{" "}
                        {notification.swapData.user1_book_title}
                      </Text>
                      <Image
                        source={{
                          uri: notification.swapData.user1_book_imgurl,
                        }}
                        style={styles.image}
                      />
                      <Text></Text>
                    </View>
                  </Pressable>
                );
              }
              break;
            case "Chosen_Book":
              if (notification) {
                return (
                  <Pressable
                    style={styles.container}
                    onPress={() => {
                      navigation.navigate("SwapOffer", {
                        info: notification.swapData,
                      });
                    }}
                  >
                    <View>
                      <Text>{notification.username} has chosen a book!</Text>
                    </View>
                  </Pressable>
                );
              }
              break;
            default:
              return null;
          }
        })}
      </View>
    </ScrollView>
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
