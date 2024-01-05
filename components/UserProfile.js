import { Dimensions, Pressable, Text, View, StyleSheet } from "react-native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function UserProfile({ session }) {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState();
  const [editing, setIsEditing] = useState(false);

  useEffect(() => {
    async function compareId(id) {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .match({ user_id: id });
      return data;
    }
    async function getData() {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;
      setUsername(session.user.user_metadata.username);
      setEmail(session.user.email);
      setId(session.user.id);
      return session.user.id;
    }
    getData()
      .then((id) => {
        return compareId(id);
      })
      .then((data) => {
        if (data.length > 0) {
          setUsername(data[0].username);
          setEmail(data[0].email_address);
          setPhone(data[0].phone_number);
        }
      });
  }, []);

  async function sendNewData() {
    const { data, error } = await supabase
      .from("Users")
      .insert([
        { username: username, email_address: email, phone_number: phone },
      ])
      .select();
  }

  async function updateData(userid) {
    const { data, error } = await supabase
      .from("Users")
      .update({ username: username, email_address: email, phone_number: phone })
      .eq("user_id", userid);
  }

  if (editing) {
    return (
      <View>
        <View style={styles.edit_container}>
          <Input
            title="Username"
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
        </View>
        <View>
          <Input
            title="Phone Number"
            placeholder="+44.............."
            value={phone}
            inputMode="numeric"
            onChangeText={(text) => {
              setPhone(text);
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              setIsEditing(false);
              if (id) {
                updateData(id);
              } else {
                sendNewData();
              }
            }}
            style={styles.edit_button}
          >
            <AntDesign name="save" size={24} color="black" />
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.username}>{username}</Text>
      </View>
      <View>
        <View>
          <Text style={styles.contact_info}>Contact Info</Text>
          <Text style={styles.title}>Email:</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.title}>Mobile:</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            setIsEditing(true);
          }}
          style={styles.edit_button}
        >
          <AntDesign name="edit" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight * 0.7,
    display: "flex",
  },
  username: {
    marginLeft: 5,
    fontSize: 36,
    textDecorationLine: "underline",
  },
  email: {
    fontSize: 24,
    marginLeft: 25,
    marginBottom: 20,
  },
  phone: {
    fontSize: 24,
    marginLeft: 25,
    marginBottom: 7,
  },
  edit_button: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: "grey",
    borderWidth: 2,
    padding: 4,
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  contact_info: {
    marginLeft: 5,
    marginTop: screenHeight * 0.3,
    textDecorationLine: "underline",
    fontSize: 34,
    marginBottom: 8,
  },
  title: {
    marginLeft: 7,
    marginBottom: 7,
    fontSize: 24,
  },
  edit_container: {
    marginTop: 30,
  }
});
