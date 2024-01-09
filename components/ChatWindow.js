import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
  });

  return (
    <View>
      {chatMessages.map((message) => {
        return message.sender_id === session.user.id ? (
          <Text>It's my message: {message.message}</Text>
        ) : (
          <Text>It's their message: {message.message}</Text>
        );
      })}
    </View>
  );
}
