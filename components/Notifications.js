import React from "react";
import { View, Text, Pressable,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Notifications = () => {
  const navigation = useNavigation();
  
  return (
    <View>
      <Text>This is Notifications Screen</Text>
      <Pressable onPress={() => navigation.navigate("SwapNegotiationPage")} style={styles.button}>
        <Text>Swap Offer notification card</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor:'blue',
    backgroundColor:'blue'
  }
})

export default Notifications;
