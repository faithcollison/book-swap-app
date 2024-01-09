import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import Messages from "./components/Messages";
import Notifications from "./components/Notifications";
import CreateListing from "./components/Create_Listing";
import Search_Existing_Book from "./components/Search_Existing_Book";
import ListedBook from "./components/ListedBook";
import SwapNegotiationPage from "./components/SwapNegotiationPage";
import DrawerNavigator from "./components/Menu";
import AvailableListings from "./components/AvailableListings";
import SwapOffer from "./components/SwapOffer";
import User2LibraryPage from "./components/User2Library";
import GenreList from "./components/GenreList";

const Stack = createNativeStackNavigator();

function App() {
  const [session, setSession] = useState(null);
  const [newNotif, setNewNotif] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? (
        <Stack.Navigator>
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
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            initialParams={{ session: session }}
          />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            initialParams={{ session: session, setNewNotif: setNewNotif }}
          />
          <Stack.Screen
            name="CreateListing"
            component={CreateListing}
            initialParams={{ session: session }}
          />
          <Stack.Screen
            name="AvailableListings"
            component={AvailableListings}
            initialParams={{ session: session }}
          />
          <Stack.Screen
            name="ListedBook"
            component={ListedBook}
            initialParams={{ session: session }}
          />
          <Stack.Screen
            name="SwapNegotiationPage"
            component={SwapNegotiationPage}
          />
          <Stack.Screen
            name="Search_Existing_Book"
            component={Search_Existing_Book}
          />
          <Stack.Screen name="SwapOffer" component={SwapOffer} />
          <Stack.Screen
            name="User2Library"
            component={User2LibraryPage}
            initialParams={{ session: session }}
            options={{
              headerTintColor: "#000",
              headerTitleStyle: {
                color: "#fff",
              },
            }}
          />
          <Stack.Screen 
              name="GenreList"
              component={GenreList}
          />
        </Stack.Navigator>
      ) : (
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
        </Stack.Navigator>
      )}
      {session && session.user && <Footer newNotif={newNotif} />}
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
