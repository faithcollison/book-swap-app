import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import supabase from "./config/supabaseClient";
import {
  AvailableListings,
  Welcome,
  Login,
  SignUp,
  Footer,
  User2LibraryPage,
  UserProfile,
  Notifications,
  CreateListing,
  Search_Existing_Book,
  ListedBook,
  SwapNegotiationPage,
  SwapOffer,
  DrawerNavigator,
  GenreList,
  ReconsiderLibrary,
  ChatComponent,
  ChatWindow,
} from "./components/index";


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
            name="Drawer"
            component={DrawerNavigator}
            options={{
              title: "Drawer",
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
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="Messages"
            component={ChatComponent}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            initialParams={{ session: session, setNewNotif: setNewNotif }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="CreateListing"
            component={CreateListing}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="AvailableListings"
            component={AvailableListings}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="ListedBook"
            component={ListedBook}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="SwapNegotiationPage"
            component={SwapNegotiationPage}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="Search_Existing_Book"
            component={Search_Existing_Book}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="SwapOffer"
            component={SwapOffer}
            initialParams={{ session: session }}
          />
          <Stack.Screen
            name="User2Library"
            component={User2LibraryPage}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerTintColor: "#000",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="GenreList"
            component={GenreList}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen
            name="ReconsiderLibrary"
            component={ReconsiderLibrary}
            initialParams={{ session: session }}
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
            }}
          />
          <Stack.Screen name="ChatWindow" component={ChatWindow} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "#06A77D",
              },
              headerTintColor: "white",
            }}
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
