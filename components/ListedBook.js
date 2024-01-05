import { Text, StyleSheet, Pressable } from "react-native";
import { View } from "react-native-web";

export default function ListedBook() {
  return (
    <View>
      <Text>This is the listed book page</Text>
      <Pressable style={styles.button}>
        <Text>Button to request swap</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
});
