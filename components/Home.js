import { View, Text } from "react-native";
import { useEffect } from "react";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";

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
    <View>
      <Text>You're in the home screen!</Text>
      <Button
        title="sign out"
        onPress={() => {
          //   supabase.auth.signOut();
          navigation.navigate("UserProfile");
        }}
      />
    </View>
  );
};

export default HomeScreen;
