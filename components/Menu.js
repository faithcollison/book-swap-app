import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import HomeScreen from "./Home";
import WishList from "./WishList";
import UserLibrary from "./UserLibrary";
import SignOutScreen from "./SignOut";
import SwapHistory from "./SwapHistory";
import { Image } from "react-native-elements";

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

	const logo = () => (
		<Image
			source={require("../assets/IMG_5454.png")}
			style={{
				width: 40,
				height: 40,
				borderRadius: 20,
				marginRight: 10,
				marginBottom: 10,
			}}
		/>
	);

	return (
		<Drawer.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: "#06A77D",
				},
				headerTintColor: "white",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: "21",
				},
				headerTitleAlign: "center",
			}}
		>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerTitle: "", headerTitleAlign: "center", headerRight: logo }}
				initialParams={{ session: session }}
			/>
			<Drawer.Screen
				name="User Library"
				options={{ headerTitle: "",headerTitleAlign: "center", headerRight: logo }}
			>
				{(props) => <UserLibrary {...props} session={session} />}
			</Drawer.Screen>
			<Drawer.Screen
				name="Wishlist"
				options={{ headerTitle: "",headerTitleAlign: "center", headerRight: logo }}
			>
				{(props) => <WishList {...props} session={session} />}
			</Drawer.Screen>
			<Drawer.Screen name="Swap History" options={{ headerTitleAlign: "center", headerTitle: ""}}>
				{(props) => <SwapHistory {...props} session={session} />}
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
