import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import HomeScreen from "./Home";
import WishList from "./WishList";
import UserLibrary from "./UserLibrary";
import SignOutScreen from "./SignOut";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then((session) => {
			setSession(session);
		});
		supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerTitleAlign: "center" }}
			/>
			<Drawer.Screen name="User Library" options={{ headerTitleAlign: "center" }}>
				{(props) => <UserLibrary {...props} session={session} />}
			</Drawer.Screen>
			<Drawer.Screen name="Wishlist" options={{ headerTitleAlign: "center" }}>
				{(props) => <WishList {...props} session={session} />}
			</Drawer.Screen>
			<Drawer.Screen
				name="Sign Out"
				component={SignOutScreen}
				options={{ headerTitleAlign: "center" }}
			/>
		</Drawer.Navigator>
	);
}

export default DrawerNavigator;
