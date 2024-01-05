import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import BookList from "./BookList";
import Footer from "./Footer";

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
        <View style={Platform.OS === 'android' || Platform.OS === 'ios' ? styles.container : styles.webFix}>
          <Text style={styles.header}>Categories</Text>
          {categories.map(category => {
            return (
              <BookList categoryName={category} key={category}/>
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
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  webFix: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: screenHeight * 0.09,
  }
});

export default HomeScreen;
