import { View, StyleSheet, Dimensions, Text, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Footer({ newNotif }) {
	const navigation = useNavigation();

	return (
		<View style={styles.footer}>
			<View
				style={
					Platform.OS === "ios"
						? { ...styles.iosfix, ...styles.footerContent }
						: styles.footerContent
				}
			>
				<Ionicons
					name="home-outline"
					size={29}
					style={styles.icon}
					onPress={() => navigation.navigate("Home")}
				/>
				<Ionicons
					name="chatbubbles-outline"
					size={29}
					style={styles.icon}
					onPress={() => navigation.navigate("Messages")}
				/>
				<Ionicons
					name="add-outline"
					size={45}
					style={styles.icon}
					onPress={() => navigation.navigate("Search_Existing_Book")}
				/>
				<Ionicons
					name="notifications-outline"
					size={29}
					style={styles.icon}
					color={newNotif ? "red" : "white"}
					onPress={() => navigation.navigate("Notifications")}
				/>
				<Ionicons
					name="person-outline"
					size={29}
					style={styles.icon}
					onPress={() => navigation.navigate("UserProfile")}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	footer: {
		height: screenHeight * 0.09,
		justifyContent: "center",
		alignItems: "center",
		position: "fixed",
		bottom: 0,
		width: screenWidth,
		borderTopWidth: 2,
		backgroundColor: "#EBEBEB",
	},
	footerContent: {
		width: screenWidth * 0.8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	icon: {
		color: "white",
	},
	iosfix: {
		marginBottom: 20,
	},
});
