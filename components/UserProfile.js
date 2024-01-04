import { Pressable, Text, View } from "react-native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { Input } from "react-native-elements";

export default function UserProfile() {
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
        <View>
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
            title="Email"
            placeholder="Email@address.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
        </View>
        <View>
          <Input
            title="Phone Number"
            placeholder="+44.............."
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
            }}
          />
        </View>
        <View>
        </View>
        <View>
          <Pressable
            onPress={() => {
              setIsEditing(false);
              if (id) {
                updateData(id);
              } else {
                sendNewData()
              }
            }}
          >
            <Text>Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View>
      <View>
        <Text>Username: {username}</Text>
      </View>
      <View>
        <Text>Email: {email}</Text>
      </View>
      <View>
        <Text>Phone Number: {phone}</Text>
      </View>
      <View>
        <Pressable
          onPress={() => {
            setIsEditing(true);
          }}
        >
          <Text>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
}
