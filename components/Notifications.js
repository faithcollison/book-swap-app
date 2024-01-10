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
  }, [notifications]);

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
    <ScrollView style={styles.page}>
      <View style={{ justifyContent: "flex-start" }}>
        {processedNotifications.map((notification) => {
          switch (notification.type) {
            case "Swap_Request":
              if (notification.swapData) {
                return (
                  <Pressable
                    style={styles.notCard}
                    onPress={() => {
                      if (
                        Object.entries(notification.swapData).every(
                          ([key, value]) => !!value
                        )
                      ) {
                        navigation.navigate("SwapNegotiationPage", {
                          info: notification.swapData,
                          user1_book: notification.swapData,
                          user2_book: notification.swapData,
                        });
                      } else {
                        navigation.navigate("SwapOffer", {
                          info: notification.swapData,
                        });
                      }
                    }}
                  >
                    <View key={notification.swapData.offer_date}>
                      {/* <Text>{daysSince(notification.created_at)} days ago</Text> */}
                      <View style={styles.notCard}>
                        <Image
                          source={{
                            uri: notification.swapData.user1_book_imgurl,
                          }}
                          style={styles.bookCard}
                        />
                        <Text style={styles.textBox}>
                          <Text style={styles.notParaText}>
                            {notification.swapData.user2_username + " wants to swap " + notification.swapData.user1_book_title}
                          </Text>
                        </Text>
                      </View>
                      
                      
                      
                      
                      {/* <Pressable
                        onPress={() => deleteNotification(notification.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={{ color: "red" }}>Delete</Text>
                      </Pressable> */}



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
                      <Text style={styles.textBox}>
                        <Text style={styles.notParaText}>
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
  page: {
    backgroundColor: "#272727",
    flex: 1,
  },
  notParaText: {
    // fontWeight: "bold",
    color: "white",
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  notText: {
    color: "white",
  },
  bookCard: {
    // flex: 0.5,
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "contain",
  },
  notCard: {
    flex: 1,
    backgroundColor:"#464646",
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    // borderRadius: 12,
  },
  deleteButton: {
    marginTop: 8,
    alignItems: "center",
  },
  textBox: {
    display: "flex",
    // alignItems: "flex-start",
    padding: 5,
  },
});

export default Notifications;
