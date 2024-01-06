import { Text, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SwapNegotiationPage() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>This is the swap negotiation page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
});
