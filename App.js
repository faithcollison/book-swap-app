import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import HomeScreen from "./components/Home";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator style={styles.main}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen} 
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
      <Footer style={styles.footer}/>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    headerTitleAlign: "center",
    flexGrow: 1,
  },
});
