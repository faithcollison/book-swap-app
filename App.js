import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from './config/supabaseClient';

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import HomeScreen from "./components/Home";
import WishList from "./components/WishList";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import Messages from "./components/Messages";
import Notifications from "./components/Notifications";
import CreateListing from "./components/Create_Listing";
import UserLibrary from "./components/UserLibrary";
// import { supabase } from '@supabase/auth-ui-shared';
import Form from "./components/Form";

const Stack = createNativeStackNavigator();
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
      <Drawer.Screen
        name="Wish List"
        component={WishList}
        options={{ headerTitleAlign: "center" }}
      />
      <Drawer.Screen
        name="User Library"
        options={{ headerTitleAlign: "center" }}
      >
        {(props) => <UserLibrary {...props} session={session} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

function App() {
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
            initialParams={{session: session}}
          />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="CreateListing" component={CreateListing} />
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
          <Stack.Screen name="Form" component={Form} />
      </Stack.Navigator>
      )}

      {session && session.user && <Footer style={styles.footer} />}
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
