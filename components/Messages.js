import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import supabase from "../config/supabaseClient";

function getChatKey(chat) {
  const ids = [chat.sender_id, chat.receiver_id].sort();
  return ids.join("-");
}
export default function ChatComponent({ route }) {
  const [chats, setChats] = useState([]);
  const [uniqueChats, setUniqueChats] = useState([]);
  const { session } = route.params;
  const [usernames, setUsernames] = useState({});

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
        console.log(chat)
        const res = await getUsername(chat);
        setUsernames((prevUsernames) => [
          ...prevUsernames,
          [chat, res[0].username],
         ]);
         
      })
    ).then(() => console.log(usernames));
  }, [uniqueChats]);

  return (
    <View>
      {/* //render list of unique chat pairings */}
      {/* {uniqueChats.map((chat) => {
        getUsername(chat).then((res) => {
          console.log(res[0].username, "res")
          return (
            <Pressable>
              <View>
                <Text> Hello </Text>
                <Text > {res[0].username}  </Text>

              </View>
            // </Pressable>
          );
        });
        // console.log(chat);
      })} */}
      {/* {usernames.map((username) => {
      console.log(username)
     })} */}
    </View>
  );
}
