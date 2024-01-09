import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import supabase from "../config/supabaseClient";


export default function ChatWindow({ route }) {
  const { sender, receiver, username, session } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");

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
  }, [route]);

  const handlePostgresChanges = async () => {
    const res = await fetchChats();
    setChatMessages(res);
  };

  async function sendMessage() {
      let sendData = {
          sender_id: receiver,
          receiver_id: sender,
          message: text,
        };
        
        if (sender === session.user.id) {
            sendData = { sender_id: sender, receiver_id: receiver, message: text };
        }
        const { data, error } = await supabase.from("Chats").insert([sendData]);
        setText("")
    }

  supabase
    .channel("Chats")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Chats" },
      handlePostgresChanges
    )
    .subscribe();

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
        <TextInput
          placeholder="Send a message ..."
          onChangeText={setText}
          value={text}
          onSubmitEditing={sendMessage}
          style={styles.input}
        />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
