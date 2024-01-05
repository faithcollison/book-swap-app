import supabase from "../config/supabaseClient";

import { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Input } from "react-native-elements";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");


  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      }
    });

    setEmail("");
    setPassword("");

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    }
  }

  async function signUpWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    
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
          label="Username"
          leftIcon={{ type: "font-awesome", name: "user" }}
          placeholder="enter username"
          autoCapitalize={"none"}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
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
        <Button title="Sign Up" onPress={() => signUpWithEmail()} />
        <Button
          title="Sign Up With Google"
          onPress={() => signUpWithGoogle()}
        />
      </View>
    </View>
  );
}
