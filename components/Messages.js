import { useEffect, useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

import supabase from "../config/supabaseClient";

function getChatKey(chat) {
  const ids = [chat.sender_id, chat.receiver_id].sort();
  return ids.join("-");
}
export function ChatComponent({ navigation, route }) {
  const [chats, setChats] = useState([]);
  const [uniqueChats, setUniqueChats] = useState([]);
  const { session } = route.params;
  const [usernames, setUsernames] = useState([]);

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

  useEffect(() => {
    let uniqueData = chats.filter((chat, index, self) => {
      const key = getChatKey(chat);
      return !self
        .slice(0, index)
        .some((otherChat) => getChatKey(otherChat) === key);
    });

    setUniqueChats(uniqueData);
  }, [chats]);

  async function getUsername(chat) {
    let username = chat.sender_id;
    if (chat.sender_id === session.user.id) {
      username = chat.receiver_id;
    }
    const { data, error } = await supabase
      .from("Users")
      .select()
      .eq("user_id", username);
    return data;
  }

  useEffect(() => {
    Promise.all(
      uniqueChats.map(async (chat) => {
        const res = await getUsername(chat);
        if (Array.isArray(res) && res.length > 0) {
          setUsernames((prev) => [
            ...prev,
            [
              { sender: chat.sender_id },
              { receiver: chat.receiver_id },
              res[0].username,
            ],
          ]);
        }
      })
    );
  }, [uniqueChats]);

  return (
    <View style={styles.container}>
      {usernames.map((username) => {
        return (
          <Pressable
            onPress={() => {
              navigation.navigate("ChatWindow", {
                sender: username[0].sender,
                receiver: username[1].receiver,
                username: username[2],
                session: session,
              });
            }}
            key={username[2]}
            style={styles.listItem}
          >
            <Text style={styles.text} key={username[2]}>
              {username[2]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  listItem: {
    borderTopColor: "white",
    borderTopWidth: 1,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    padding: 20,
    margin: 3,
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
});
