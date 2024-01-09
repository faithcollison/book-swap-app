import React from "react";
import { View, Text } from "react-native";
import Index from "./TestCarousel";
import Test2 from "./TopTenCarousel"
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Messages = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View>
        <Text>This is Messages Screen</Text>
        <Index />
      </View>
    </GestureHandlerRootView>
  );
};

export default Messages;
