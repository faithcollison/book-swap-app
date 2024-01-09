import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import supabase from "../config/supabaseClient";

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
        style={{ position: "absolute", bottom: 0, top: 0, width: "100%" }}
        contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
      >
        {chatMessages.map((message) => {
          if (!message) {
            console.warn("Encountered undefined message object");
            return null;
          }
          return message.sender_id === session.user.id ? (
            <Text style={styles.senderMessage}>
              It's my message: {message.message}
            </Text>
          ) : (
            <Text style={styles.receiverMessage}>
              It's their message: {message.message}
            </Text>
          );
        })}
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
  },
  senderMessage: {
    alignSelf: "flex-end",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
  },
});
