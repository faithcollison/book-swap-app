import { StyleSheet, View, Dimensions, Animated } from "react-native";

const screenWidth = Dimensions.get("screen").width;

export function Pagination({ listings, scrollX }) {
  return (
    <View style={styles.container}>
      {listings.map((_, idx) => {
        const inputRange = [
          (idx - 1) * screenWidth,
          idx * screenWidth,
          (idx + 1) * screenWidth,
        ];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, { width: dotWidth }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    margin: 2,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
