import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>You're in the home screen!</Text>
      <Button
        title="sign out"
        onPress={() => {
          supabase.auth.signOut();
          navigation.navigate("Welcome");
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
