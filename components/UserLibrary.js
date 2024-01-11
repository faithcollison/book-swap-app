import { React, useCallback, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import {
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
	StyleSheet,
	RefreshControl,
	Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import {
	VollkornSC_400Regular,
	Bellefair_400Regular,
	CormorantGaramond_400Regular,
	JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
import { LinearGradient } from "expo-linear-gradient";
import Collapsible from "react-native-collapsible";

const UserLibrary = ({ session }) => {
	const [books, setBooks] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);

	useEffect(() => {
		if (session) getListings(session?.user?.user_metadata?.username);
	}, []);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const { data, error } = await supabase
			.from("Listings")
			.select("*")
			.eq("user_id", session.user.id)
			.order("date_posted", { ascending: false });

		if (error) {
			alert(error);
		} else {
			setBooks(data);
		}
		setRefreshing(false);
	}, []);

	async function getListings(username) {
		const { data, error } = await supabase
			.from("Listings")
			.select("*")
			.eq("user_id", session.user.id)
			.order("date_posted", { ascending: false });

		if (error) {
			alert(error);
		} else {
			setBooks(data);
		}
	}

	const removeFromLibrary = async (book) => {
		const { data, error } = await supabase
			.from("Listings")
			.delete()
			.eq("book_id", book.book_id);

		if (error) {
			alert(error);
		} else {
			setBooks(books.filter((item) => item.book_id !== book.book_id));
		}
	};

	const [fontsLoaded] = useFonts({
		VollkornSC_400Regular,
		Bellefair_400Regular,
		CormorantGaramond_400Regular,
		JosefinSans_400Regular,
	});

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			style={{backgroundColor: "#272727"}}
		>
			<Text style={styles.headerText}>User Library</Text>
			{books.map((book) => (
				<LinearGradient
					colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{
						borderRadius: 30,
						overflow: "hidden",
						marginBottom: 25,
					}}
				>
					<View key={book.book_id} style={styles.bookContainer}>
						<Text style={styles.categoryText}>{book.Category}</Text>
						<Text style={styles.titleText}>{book.book_title}</Text>
						<Text style={styles.authorText}>{book.author}</Text>
						<Image source={{ uri: book.img_url }} style={styles.image} />
						<Pressable
							onPress={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
							style={styles.descriptionButton}
						>
							<Text style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}>
								{isDescriptionCollapsed ? "Show Description" : "Hide Description"}
							</Text>
						</Pressable>
						<Collapsible collapsed={isDescriptionCollapsed}>
							<Text style={styles.descriptionText}>{book.description}</Text>
						</Collapsible>
						<Pressable onPress={() => removeFromLibrary(book)} style={styles.button}>
							<Text style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}>
								Remove
							</Text>
						</Pressable>
					</View>
				</LinearGradient>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		marginBottom: Dimensions.get("window").height * 0.09,
		backgroundColor: "#272727",
	},
	headerText: {
		fontFamily: "JosefinSans_400Regular",
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 16,
		color: "white",
	},
	bookContainer: {
		alignItems: "center",
		backgroundColor: "rgba(169, 169, 169, 0.15)",
		padding: 16,
		width: Dimensions.get("window").width - 32,
	},
	titleText: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 8,
		color: "white",
		fontFamily: "JosefinSans_400Regular",
	},
	authorText: {
		fontSize: 16,
		marginBottom: 8,
		color: "white",
		fontFamily: "JosefinSans_400Regular",
		textAlign: "center",
	},
	image: {
		alignItems: "center",
		height: 180 * 1.5,
		width: 120 * 1.5,
		borderRadius: 16 * 1.5,
		marginBottom: 10,
		marginTop: 10,
		resizeMode: "cover",
	},
	descriptionText: {
		fontSize: 17,
		color: "white",
		fontFamily: "CormorantGaramond_400Regular",
		textAlign: "justify",
	},
	categoryText: {
		fontSize: 20,
		marginBottom: 10,
		color: "white",
		fontFamily: "VollkornSC_400Regular",
	},
	button: {
		backgroundColor: "#C1514B",
		fontSize: 13,
		fontWeight: "bold",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 15,
		marginTop: 10,
		textAlign: "center",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	descriptionButton: {
		backgroundColor: "#3B8D77",
		fontSize: 13,
		fontWeight: "bold",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 15,
		marginTop: 10,
		textAlign: "center",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default UserLibrary;

// descriptions -> collapse all atm, collapse 1 only
