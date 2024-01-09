import React from "react";
import { View, Text, Pressable } from "react-native";
import { TouchableOpacity } from "react-native";

// export const ISButtonProps = {
//   visible: undefined,
//   onPress: undefined,
// }

const SButton = (props) => {
  const { children, visible = true, onPress } = props;

  if (!visible)
    return <></>;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pressable onPress={onPress}>
        <View
          style={{
            marginTop: 20,
            backgroundColor: "#26292E",
            borderRadius: 50,
            paddingHorizontal: 20,
            padding: 10,
          }}
        >
          <Text style={{ color: "white" }}>{children}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SButton;