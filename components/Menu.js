import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Home";
import WishList from "./WishList";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="Wish List"
				component={WishList}
				options={{ headerTitleAlign: "center" }}
			/>
		</Drawer.Navigator>
	);
}

export default DrawerNavigator