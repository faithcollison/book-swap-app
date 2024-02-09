import { useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";

import supabase from "../config/supabaseClient";

export function SignUp() {
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
      },
    });

    setEmail("");
    setPassword("");
    setUsername("");

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope", color: "white" }}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Username"
          leftIcon={{ type: "font-awesome", name: "user", color: "white" }}
          placeholder="Enter username"
          autoCapitalize={"none"}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
          secureTextEntry={true}
          placeholder="Enter password"
          autoCapitalize={"none"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => signUpWithEmail()}
          buttonStyle={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272727",
  },
  inputContainer: {
    width: 300,
    marginBottom: 10,
  },
  buttonContainer: {
    width: 200,
  },
  button: {
    backgroundColor: "#06A77D",
    width: 200,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 20,
  },
});
