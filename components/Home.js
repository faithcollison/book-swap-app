import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import BookList from "./BookList";
import Footer from "./Footer";
import TopTenCarousel from "./TopTenCarousel";

const screenHeight = Dimensions.get("window").height;

const HomeScreen = ({  navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currSession, setCurrSession] = useState();
  const [topTen, setTopTen] = useState([])

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
			const { data, error } = await supabase.from("Listings").select("Category");
			const catArr = [];
			data.forEach((obj) => {
				if (!catArr.includes(obj.Category)) catArr.push(obj.Category);
			});
			setCategories(catArr);
		}

    async function getTopTen (table) {
      const { data, error } = await supabase
        .from(table)
        .select()
        .order('no_of_wishlists', { ascending: false })
        .range(0, 9)
      setTopTen(data);
    }
  
    getTopTen("Listings")
    getCategories();
  }, []);


	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View
				style={
					Platform.OS === "web"
						? { ...styles.container, ...styles.webFix }
						: styles.container
				}
			>
				<TopTenCarousel listings={topTen}/>
				<Text style={styles.header}>Categories</Text>
				{categories.map((category) => {
					return (
						<BookList categoryName={category} key={category} id={currSession} />
					);
				})}
				<StatusBar style="auto" />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: "#272727",
	},
	webFix: {
		marginBottom: screenHeight * 0.09,
	},
	header: {
		fontSize: 29,
		fontFamily: "VollkornSC_400Regular",
		fontWeight: 500,
		color: "white",
    marginBottom: 25,
	},
});

export default HomeScreen;
