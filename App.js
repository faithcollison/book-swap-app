import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import { Session } from "@supabase/supabase-js";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import Messages from "./components/Messages";
import Notifications from "./components/Notifications";
import CreateListing from "./components/Create_Listing";
import Form from "./components/Form";
import Search_Existing_Book from "./components/Search_Existing_Book";
import SingleBookListings from "./components/SingleBookListings";
import ListedBook from "./components/ListedBook";
import SwapNegotiationPage from "./components/SwapNegotiationPage";
import DrawerNavigator from "./components/Menu";


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
            name="SingleBookListings"
            component={SingleBookListings}
          />
          <Stack.Screen name="ListedBook" component={ListedBook} />
          <Stack.Screen name="SwapNegotiationPage" component={SwapNegotiationPage} />
          <Stack.Screen
            name="Search_Existing_Book"
            component={Search_Existing_Book}
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
      {session && session.user && <Footer newNotif={newNotif}/>}
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
