import { View, Text } from "react-native";
import { useEffect } from "react";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    async function compareId(id) {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .match({ user_id: id });
      return data;
    }
    async function getData() {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;
      return session.user.id;
    }
    getData()
      .then((id) => {
        return compareId(id);
      })
      .then((data) => {
        if (data.length === 0) {
          navigation.navigate("UserProfile");
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>You're in the home screen!</Text>
      <Button
        title="sign out"
        onPress={() => {
          //   supabase.auth.signOut();
          navigation.navigate("UserProfile");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
