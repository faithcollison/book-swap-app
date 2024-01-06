
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import supabase from "../config/supabaseClient";

const Notifications = ({ route }) => {
  const [notifications, setNotifications] = useState([]);
  const { session, setNewNotif } = route.params;

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

    if(data.length > length){
      setNewNotif(true)
    }

    return data;
  }

  const handlePostgresChanges = async () => {
    const length = notifications.length
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
      <Pressable onPress={() => navigation.navigate("SwapNegotiationPage")} style={styles.button}>
        <Text>Swap Offer notification card</Text>
      </Pressable>
      {notifications.map((notification) => (
        <View key={notification.offer_date}>
          <Text>{notification.offer_date}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor:'blue',
    backgroundColor:'blue'
  }
})

export default Notifications;
