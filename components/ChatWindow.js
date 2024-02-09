import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import supabase from "../config/supabaseClient";

export function ChatWindow({ route }) {
  const { sender, receiver, session } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");

  async function fetchChats() {
    const { data, error } = await supabase
      .from("Chats")
      .select()
      .in("sender_id", [sender, receiver])
      .in("receiver_id", [sender, receiver]);
    return data;
  }
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
    setText("");
  }
  
  supabase
    .channel("Chats")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Chats" },
      handlePostgresChanges
    )
    .subscribe();

  const handlePostgresChanges = async () => {
    const res = await fetchChats();
    setChatMessages(res);
  };
  useEffect(() => {
    fetchChats().then(setChatMessages);
  }, []);
  const scrollViewRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 500);
  }, [chatMessages]);


  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          marginBottom: Dimensions.get("window").height * 0.078,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {chatMessages.map((message) => {
          if (!message) {
            console.warn("Encountered undefined message object");
            return null;
          }
          return message.sender_id === session.user.id ? (
            <View style={styles.senderMessage}>
              <Text>{message.message}</Text>
            </View>
          ) : (
            <View style={styles.receiverMessage}>
              <Text>{message.message}</Text>
            </View>
          );
        })}
      </ScrollView>
      {Platform.OS !== "web" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Send a message ..."
              onChangeText={setText}
              value={text}
              onSubmitEditing={sendMessage}
              style={styles.input}
            />
          </View>
        </KeyboardAvoidingView>
      )}
      {Platform.OS === "web" && (
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Send a message ..."
              onChangeText={setText}
              value={text}
              onSubmitEditing={sendMessage}
              style={styles.input}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727",
    overflow: "hidden",
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  footer: {
    justifyContent: "flex-end",
    marginBottom: Dimensions.get("window").height * 0.08,
    height: 10,
  },

  senderMessage: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    alignSelf: "flex-end",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    maxWidth: "70%",
    backgroundColor: "#2b88cf",
  },
  receiverMessage: {
    backgroundColor: "#dadfe3",
    fontFamily: "CormorantGaramond_400Regular",
    color: "black",
    fontSize: 16,
    alignSelf: "flex-start",
    padding: 5,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    maxWidth: "70%",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});
