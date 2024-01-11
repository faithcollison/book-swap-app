import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
	View,
	StyleSheet,
	Pressable,
	Text,
	Dimensions,
	Image,
	ScrollView,
} from "react-native";
import supabase from "../config/supabaseClient";
import BookListCard from "./BookListCard";
import { useFonts } from "expo-font";
import {
	Bellefair_400Regular,
	JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

export default function BookList({ categoryName, id }) {
  const [bookList, setBookList] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    async function getBooks(categoryName) {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("Category", categoryName)
        .range(0, 19)
      setBookList(data);
    }

		getBooks(categoryName);
	}, []);

	const [fontsLoaded] = useFonts({
		Bellefair_400Regular,
		JosefinSans_400Regular,
	});

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.categoryContainer}>
			<Text style={styles.categoryHeader}>{categoryName}</Text>
			<View style={styles.categoryList}>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
					{bookList.map((listing) => {
						return <BookListCard listing={listing} key={listing.book_id} id={id} />;
					})}
					<View style={styles.cardContainer}>
						<Pressable style={styles.linkCard} onPress={() => navigation.navigate('GenreList', {genre: categoryName})}>
							<Ionicons name="arrow-forward" size={30} color="white" />
						</Pressable>
					</View>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	categoryContainer: {
		alignItems: "center",
		flex: 1,
	},
	categoryHeader: {
		flexDirection: "row",
		flex: 1,
		width: screenWidth * 0.9,
		alignItems: "center",
		justifyContent: "space-between",
		color: "white",
		fontSize: 21.5,
		fontFamily: "JosefinSans_400Regular",
		fontWeight: 400,
		marginTop: 20,
	},
	categoryList: {
		width: screenWidth,
		marginTop: 10,
		marginTop: 7,
		marginBottom: 10,
	},
	cardContainer: {
		flex: 1,
		width: screenWidth / 3,
		padding: 5,
		justifyContent: "center",
		alignItems: 'center',
	},
	linkCard: {
		height: 50,
		width: 50,
		borderRadius: 35,
		backgroundColor: '#06A77D',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
