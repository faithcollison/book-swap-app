import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import supabase from "../config/supabaseClient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Login({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function signInWithEmail() {
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			Alert.alert(error.message);
		} else {
			setEmail("");
			setPassword("");
			navigation.navigate("Home");
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<Input
					label="Email"
					leftIcon={{ type: "font-awesome", name: "envelope", color: "white" }}
					placeholder="email@address.com"
					autoCapitalize={"none"}
					value={email}
					onChangeText={(text) => {
						setEmail(text);
					}}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Input
					label="Password"
					leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
					secureTextEntry={true}
					placeholder="Password"
					autoCapitalize={"none"}
					value={password}
					onChangeText={(text) => {
						setPassword(text);
					}}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					title="Sign In"
					onPress={() => signInWithEmail()}
					buttonStyle={styles.button}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#272727",
	},
	inputContainer: {
		width: 300,
		marginBottom: 10,
	},
	buttonContainer: {
		width: 200,
		marginTop: 10,
	},
	button: {
		backgroundColor: "#06A77D",
		width: 200,
		height: 42,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},
});

//placeholder colour matches background - > change so it doesn't 'dissapear'
