import { View, Text, Pressable, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import BookList from "./BookList";
import { ScrollView } from "react-native-gesture-handler";

const screenHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([])

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

  useEffect(() => {
    async function getCategories() {
      const { data, error } = await supabase
        .from('Listings')
        .select('Category')
      const catArr = [];
      data.forEach(obj => {
        if (!catArr.includes(obj.Category)) catArr.push(obj.Category)
      })
      setCategories(catArr)
    }

    getCategories();
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Categories</Text>
        {categories.map(category => {
          return (
            <BookList categoryName={category}/>
          )
        })}
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: screenHeight * 0.09,
  },
});

export default HomeScreen;
