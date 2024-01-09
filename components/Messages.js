import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import supabase from "../config/supabaseClient";

export default function ChatComponent({ route }) {
  const [chats, setChats] = useState([]);
  const { session } = route.params;

  useEffect(() => {
    fetchChats().then(setChats);
  }, []);

  async function fetchChats() {
    const { data, error } = await supabase
      .from("Chats")
      .select()
      .or(`sender_id.eq.${session.user.id}, receiver_id.eq.${session.user.id}`);

    return data;
  }

  const handlePostgresChanges = async () => {
    const length = chats.length;
    const res = await fetchChats(length);
    setChats(res);
  };

  supabase
    .channel("Chats")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Chats" },
      handlePostgresChanges
    )
    .subscribe();

  return (
    <View>
      {chats.map((chat) => {
        return <Text key={chat.id}>{chat.message}</Text>;
      })}
    </View>
  );
}
