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

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("Notifications")
        .delete()
        .eq("id", notificationId);
    } catch (error) {
      console.log(error);
    }
  };

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

  function daysSince(dateString) {
    const notificationDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - notificationDate;
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysPassed;
  }

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
    <ScrollView>
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
                      <Text>{daysSince(notification.created_at)} days ago</Text>
                      <Text style={styles.flex}>
                        <Image
                          source={{
                            uri: notification.swapData.user1_book_imgurl,
                          }}
                          style={styles.image}
                        />
                        <Text>
                          <Text style={{ fontWeight: "bold" }}>
                            {notification.swapData.user2_username}
                          </Text>
                          <Text> </Text>
                          would like to create a swap for
                          <Text> </Text>
                          <Text style={{ fontWeight: "bold" }}>
                            {notification.swapData.user1_book_title}
                          </Text>
                        </Text>
                      </Text>
                      <Pressable
                        onPress={() => deleteNotification(notification.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={{ color: "red" }}>Delete</Text>
                      </Pressable>
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
                      navigation.navigate("SwapNegotiationPage", {
                        info: notification,
                      });
                    }}
                  >
                    <View>
                      <Text>{daysSince(notification.created_at)} days ago</Text>
                      <Text style={styles.flex}>
                        <Text style={{ fontWeight: "bold" }}>
                          {notification.username}{" "}
                        </Text>
                        <Image
                          source={{ uri: notification.swapData }}
                          class={styles.image}
                        />
                        <Text>has chosen a book from your library</Text>
                        <Pressable
                          onPress={() => deleteNotification(notification.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={{ color: "red" }}>Delete</Text>
                        </Pressable>
                      </Text>
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
    display: "flex",
    margin: "auto",
    borderColor: "gray",
    borderWidth: 2,
    width: "auto",
    alignItems: "center",
    width: "80%",
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 8,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 120,
    padding: 50,
    margin: 10,
    borderRadius: 4,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Notifications;
