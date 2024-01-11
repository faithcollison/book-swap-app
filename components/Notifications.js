import { useEffect, useRef, useState } from "react";
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
import { Entypo } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

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

  supabase
    .channel("Notifications")
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "Notifications" },
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
    <ScrollView style={styles.pageContainer}>
      <View style={styles.notificationsList}>
        {processedNotifications.map((notification) => {
          switch (notification.type) {
            case "Swap_Request":
              if (notification.swapData) {
                return (
                  <View style={styles.notificationContainer}>
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
                            notification: notification,
                          });
                        }
                      }}
                    >
                      <Image
                        source={{
                          uri: notification.swapData.user1_book_imgurl,
                        }}
                        style={styles.bookImg}
                      />
                      <View style={styles.textContent}>
                        <View style={styles.header}>
                          <Text style={styles.headerText}>
                            {daysSince(notification.created_at)} days ago
                          </Text>
                          <Entypo
                            name="circle-with-cross"
                            size={24}
                            color="#C1514B"
                            onPress={() => deleteNotification(notification.id)}
                          />
                        </View>
                        <View style={styles.messageBorder}>
                          <Text style={styles.message}>
                            <Text
                              style={{
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              {notification.swapData.user2_username}
                            </Text>{" "}
                            wants to swap{" "}
                            <Text
                              style={{
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              {notification.swapData.user1_book_title}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              }
              break;
            case "Chosen_Book":
              if (notification.swapData) {
                return (
                  <View style={styles.notificationContainer}>
                    <Pressable
                      style={styles.notCard}
                      onPress={() => {
                        navigation.navigate("SwapNegotiationPage", {
                          info: notification.swapData,
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri: notification.swapData.user2_book_imgurl,
                        }}
                        style={styles.bookImg}
                      />
                      <View style={styles.textContent}>
                        <View style={styles.header}>
                          <Text style={styles.headerText}>
                            {daysSince(notification.created_at)} days ago
                          </Text>
                          <Entypo
                            name="circle-with-cross"
                            size={24}
                            color="#C1514B"
                            onPress={() => deleteNotification(notification.id)}
                            style={styles.deleteButton}
                          />
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <View style={styles.messageBorder}>
                            <Text style={styles.message}>
                              <Text
                                style={{
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                {notification.swapData.user1_username}
                              </Text>{" "}
                              has chosen{" "}
                              <Text
                                style={{
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                {notification.swapData.user2_book_title}
                              </Text>{" "}
                              from your library!
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  </View>
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
  pageContainer: {
    backgroundColor: "#272727",
    width: width,
    flex: 1,
  },
  webFix: {
    marginBottom: height * 0.09,
  },
  notificationsList: {
    width: width * 0.9,
  },
  notificationContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  notCard: {
    flex: 1,
    flexDirection: "row",
    width: width * 0.9,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  contentsMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9 - 20,
    height: 90,
    maxWidth: width * 0.9 - 20,
  },
  bookImg: {
    height: 120,
    width: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  notText: {
    color: "#C2C2C2",
    width: width * 0.9 * 0.9 * 0.8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 18,
  },
  headerText: {
    textAlign: "right",
    color: "white",
    fontSize: 15,
  },
  message: {
    flex: 1,
    fontSize: 15,
    color: "white",
    marginHorizontal: 10,
  },
  messageBorder: {
    padding: 10,
    marginHorizontal: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default Notifications;
