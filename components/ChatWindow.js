import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import supabase from "../config/supabaseClient";
import { Input } from "react-native-elements";

export default function ChatWindow({ route }) {
  const { sender, receiver, username, session } = route.params;
  const [chatMessages, setChatMessages] = useState([]);

  async function fetchChats() {
    const { data, error } = await supabase
      .from("Chats")
      .select()
      .or([
        `sender_id.eq.${sender}, receiver_id.eq.${receiver}`,
        `sender_id.eq.${receiver}, receiver_id.eq.${sender}`,
      ]);

    return data;
  }

  useEffect(() => {
    fetchChats().then(setChatMessages);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          position: "absolute",
          bottom: Dimensions.get("window").height * 0.09,
          top: 0,
          width: "100%",
        }}
        contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
      >
        {chatMessages.map((message) => {
          if (!message) {
            console.warn("Encountered undefined message object");
            return null;
          }
          return message.sender_id === session.user.id ? (
            <Text style={styles.senderMessage}>
              {session.user.user_metadata.username}: {message.message}
            </Text>
          ) : (
            <Text style={styles.receiverMessage}>
              {username}: {message.message}
            </Text>
          );
        })}
        {/* <Input label="SendMessage" placeholder="Send a message ..." /> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    top: 0,
    width: "100%",
    // marginBottom: Dimensions.get("window").height * 0.09,
  },
  senderMessage: {
    alignSelf: "flex-end",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
});
