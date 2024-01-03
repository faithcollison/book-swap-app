import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import supabase from "../config/supabaseClient";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Login({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      setEmail("");
      setPassword("");
      navigation.navigate("Home");
    }
  }

  return (
    <View>
      <View>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
      </View>
      <View>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>
      <View>
        <Button title="Sign In" onPress={() => signInWithEmail()} />
      </View>
    </View>
  );
}
