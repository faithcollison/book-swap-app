import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import HomeScreen from "./components/Home";
import WishList from "./components/WishList";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerTitleAlign: "center" }}
			/>
			<Drawer.Screen
				name="Wish List"
				component={WishList}
				options={{ headerTitleAlign: "center" }}
			/>
		</Drawer.Navigator>
	);
}

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Welcome"
					component={Welcome}
					options={{ headerTitleAlign: "center" }}
				/>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{ headerTitleAlign: "center" }}
				/>
				<Stack.Screen
					name="SignUp"
					component={SignUp}
					options={{ headerTitleAlign: "center" }}
				/>
				<Stack.Screen
					name="Home"
					component={DrawerNavigator}
					options={{
						title: "Home",
						headerShown: false,
						headerStyle: {
							backgroundColor: "#72d5ff",
						},
						headerTintColor: "black",
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
				<Stack.Screen name="UserProfile" component={UserProfile} />
			</Stack.Navigator>
			<Footer style={styles.footer} />
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

export default App;

const styles = StyleSheet.create({
	text: {
		alignItems: "center",
	},
	container: {
		flex: 1,
	},
	main: {
		headerTitleAlign: "center",
		flexGrow: 1,
	},
});
