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
	VollkornSC_400Regular,
	Bellefair_400Regular,
	CormorantGaramond_400Regular,
	Lora_400Regular,
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
		VollkornSC_400Regular,
		Bellefair_400Regular,
		CormorantGaramond_400Regular,
		Lora_400Regular,
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
		fontFamily: "VollkornSC_400Regular",
	},
	categoryHeader: {
		flexDirection: "row",
		flex: 1,
		width: screenWidth * 0.9,
		alignItems: "center",
		justifyContent: "space-between",
		color: "white",
		fontSize: 21,
		// fontFamily: "Bellefair_400Regular",
		fontFamily: "VollkornSC_400Regular",
		fontWeight: 500,
	},
	categoryList: {
		width: screenWidth,
		// flexDirection: "row",
		marginTop: 10,
		// fontFamily: "CormorantGaramond_400Regular",
		marginTop: 7,
		marginBottom: 10,
		// marginLeft: 16, //changed from anas
	},
	seemore: {
		// fontFamily: "Lora_400Regular",
		// fontFamily: "Bellefair_400Regular",
		fontFamily: 'JosefinSans_400Regular',
		fontSize: 17,
    fontWeight: 500,
		color: "white",
	},
	cardContainer: {
		flex: 1,
		width: screenWidth / 3,
		padding: 5,
		justifyContent: "center",
		alignItems: 'center',
	},
	linkCard: {
		height: 70,
		width: 70,
		borderRadius: 35,
		backgroundColor: '#06A77D',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
