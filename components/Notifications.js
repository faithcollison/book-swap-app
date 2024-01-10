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
import { Entypo } from '@expo/vector-icons';
import { Dimensions } from "react-native";

const {width, height} = Dimensions.get('screen');

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
    <ScrollView style={styles.scroll}>
      <View style={styles.page}>
        <View style={styles.notificationsList}>
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
                        {/* <Text>{daysSince(notification.created_at)} days ago</Text> */}
                        <View key={notification.swapData.offer_date} style={styles.contentsMain}>
                          <Image
                            source={{
                              uri: notification.swapData.user1_book_imgurl,
                            }}
                            style={styles.bookImage}
                          />
                          <Text style={styles.notText}>
                            {notification.swapData.user2_username + " wants to swap " + notification.swapData.user1_book_title}
                          </Text>
                        </View>
                        <Entypo name="circle-with-cross" size={24} color='#C2C2C2' onPress={() => deleteNotification(notification.id)} style={styles.deleteButton}/>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#272727",
  },
  page: {
    flex: 1,
    alignItems: 'center',
  },
  notificationsList: {
    width: width * 0.9,
  },
  notCard: {
    backgroundColor:"#464646",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 20,
    padding: 10,
  },
  contentsMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9 - 20,
    height: 90,
  },
  bookImage: {
    height: 90,
    width: 60,
    borderRadius: 6,
    // marginRight: 20,

  },
  notText: {
    color: '#C2C2C2',
    width: width * 0.9 * 0.9 * 0.8,
  },
  deleteButton: {
    position: 'absolute',
    right: 8,
    top: 7,
  }
});

export default Notifications;
