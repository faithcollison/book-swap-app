import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useFonts } from "expo-font";
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";

import supabase from "../config/supabaseClient";

export function Welcome({ navigation }) {
  useEffect(() => {
    const checkUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session.session.user) {
        navigation.navigate("Home");
      }
    };

    checkUser();
  }, []);

  const Logo = () => (
    <Image
      source={{
        uri: "https://img.freepik.com/free-vector/hand-drawn-book-cartoon-illustration_52683-130773.jpg",
      }}
      style={{
        width: 250,
        height: 250,
        borderRadius: 200,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 70,
      }}
    />
  );

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={styles.button}
        >
          <Text style={styles.text}>Log In</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("SignUp");
          }}
          style={styles.button}
        >
          <Text style={styles.text}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#272727",
    flex: 1,
  },
  button: {
    backgroundColor: "#06A77D",
    width: 200,
    height: 42,
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: "#06A77D",
  },
  text: {
    fontSize: 20,
    fontFamily: "JosefinSans_400Regular",
    fontWeight: 500,
    color: "white",
  },
});
