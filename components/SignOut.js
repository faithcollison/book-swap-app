import { useEffect } from "react";
import supabase from "../config/supabaseClient";
import { View, Text } from "react-native";

const SignOutScreen = () => {
	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out: ", error);
		} else {
			console.log("User signed out");
		}
	};

	useEffect(() => {
		handleSignOut();
	}, []);

	return (
		<View>
			<Text>Signing out...</Text>
		</View>
	);
};

export default SignOutScreen