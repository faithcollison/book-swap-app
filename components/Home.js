import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";

import supabase from "../config/supabaseClient";
import { BookList, TopTenCarousel } from "./index";

const { height } = Dimensions.get("window");

export const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currSession, setCurrSession] = useState();
  const [topTen, setTopTen] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollRef = useRef();
  const scrollOffsetLimit = 200;

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
      setCurrSession(session.user.id);
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
        .from("Listings")
        .select("Category");
      const catArr = [];
      data.forEach((obj) => {
        if (!catArr.includes(obj.Category)) catArr.push(obj.Category);
      });
      setCategories(catArr);
    }
    async function getTopTen(table) {
      const { data, error } = await supabase
        .from(table)
        .select()
        .order("no_of_wishlists", { ascending: false })
        .range(0, 9);
      setTopTen(data);
    }
    getTopTen("Listings");
    getCategories();
  }, []);

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          onScroll={(event) => {
            setScrollOffset(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
        >
          <View
            style={
              Platform.OS === "web"
                ? { ...styles.container, ...styles.webFix }
                : styles.container
            }
          >
            <Text style={styles.spotlight}>Spotlight</Text>
            <Text style={styles.topTen}>Top 10 Charts</Text>
            <TopTenCarousel listings={topTen} />
            {categories.map((category) => {
              return (
                <BookList
                  categoryName={category}
                  key={category}
                  id={currSession}
                />
              );
            })}
            <StatusBar style="auto" />
          </View>
        </ScrollView>
        <Pressable
          style={styles.BTTContainer}
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <View style={styles.BTTCircle}>
            <Ionicons
              name="arrow-up"
              size={35}
              color="black"
              style={styles.BTTArrow}
            />
          </View>
        </Pressable>
      </View>
      {scrollOffset > scrollOffsetLimit && (
        <Pressable
          style={
            Platform.OS === "web"
              ? { ...styles.BTTContainer, ...styles.BTTHeight }
              : styles.BTTContainer
          }
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <View style={styles.BTTCircle}>
            <Ionicons
              name="arrow-up"
              size={30}
              color="black"
              style={styles.BTTArrow}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#272727",
  },
  webFix: {
    marginBottom: height * 0.09,
  },
  spotlight: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 7,
    color: "white",
    fontFamily: "JosefinSans_400Regular",
  },
  topTen: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "white",
    fontFamily: "JosefinSans_400Regular",
  },
  header: {
    fontSize: 29,
    fontFamily: "JosefinSans_400Regular",
    fontWeight: 500,
    color: "white",
    marginBottom: 25,
  },
  BTTContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  BTTHeight: {
    bottom: 98,
  },
  BTTCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  BTTArrow: {
    textAlign: "center",
    width: "100%",
  },
});
