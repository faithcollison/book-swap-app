import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.centerText}>Welcome!</Text> */}

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={styles.button}
        >
          <Text>Log In</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("SignUp");
          }}
          style={styles.button}
        >
          <Text>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    height: 68,
    marginHorizontal: 20,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "lightgrey",
    width: 100,
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 2,
  },
});
