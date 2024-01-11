import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from "@expo/vector-icons";

import BookList from "./BookList";
import TopTenCarousel from "./TopTenCarousel";

const {height, width} = Dimensions.get("window");

const HomeScreen = ({  navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currSession, setCurrSession] = useState();
  const [topTen, setTopTen] = useState([]);
  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollOffsetLimit = 200

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
		<View style={{flex: 1,}}>
			<View style={{flex: 1,}}>
			<ScrollView showsVerticalScrollIndicator={false} ref={scrollRef} onScroll={event => {
				setScrollOffset(event.nativeEvent.contentOffset.y);
			}} scrollEventThrottle={16}>
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
			<Pressable style={styles.BTTContainer} onPress={() => {
				// console.log(scrollRef, '<<<<')
				scrollRef.current?.scrollTo({
					y : 0,
					animated : true
				});
			}}>
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
				<Pressable style={Platform.OS === 'web' ? {...styles.BTTContainer, ...styles.BTTHeight} : styles.BTTContainer} onPress={() => {
					scrollRef.current?.scrollTo({
						y : 0,
						animated : true
					});
				}}>
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
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: "#272727",
	},
	webFix: {
		marginBottom: height * 0.09,
	},
	header: {
		fontSize: 29,
		fontFamily: "VollkornSC_400Regular",
		fontWeight: 500,
		color: "white",
    marginBottom: 25,
	},
	BTTContainer: {
		position: 'absolute',
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
		backgroundColor: 'white',
		shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 16,
		justifyContent: 'center',
		alignContent: 'center',
	},
	BTTArrow: {
		textAlign: 'center',
		width: '100%',
	}
});

export default HomeScreen;
