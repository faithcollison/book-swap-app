import { Text, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SwapNegotiationPage({ route }) {
  const navigation = useNavigation();

  const { user1_book, user2_book } = route.params;



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
