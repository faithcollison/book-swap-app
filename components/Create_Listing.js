import React, { useState } from "react";
import { View, TextInput, Text, Picker } from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StyleSheet } from "react-native-web";

const CreateListing = ({ route }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [category, setCategory] = useState("");
	const [condition, setCondition] = useState("");
	const [description, setDescription] = useState("");
	const { session } = route.params;

	// option to post listing V
	// option to edit listing
	// option to delete listing

	const conditions = [
		"New",
		"Like New",
		"Very Good",
		"Good",
		"Acceptable",
		"Well-Worn",
		"Fair",
		"Poor",
	];

	const categories = [
		"Fiction",
		"Mystery",
		"Romance",
		"Sci-Fi",
		"Fantasy",
		"Horror",
		"Thriller",
		"Historical Fiction",
		"Non-Fiction",
		"Biography",
		"Autobiography",
		"Self-Help",
		"Philosophy",
		"Science",
		"Travel",
		"Poetry",
		"Drama",
		"Comedy",
		"Children's",
		"Young Adult",
	];

	const handleSubmit = async () => {
		const { data, error } = await supabase
			.from("Listings")
			.insert([
				{
					book_title: title,
					author: author,
					Category: category,
					condition: condition,
					description: description,
				},
			])
			.select();

		if (error) {
			console.error("Error inserting data: ", error);
			return;
		}
		console.log("Data inserted: ", data);
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					placeholder="Title"
					onChangeText={setTitle}
					value={title}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Author</Text>
				<TextInput
					style={styles.input}
					placeholder="Author"
					onChangeText={setAuthor}
					value={author}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Category</Text>
				<Picker
					style={styles.input}
					selectedValue={category}
					onValueChange={(itemValue) => setCategory(itemValue)}
				>
					<Picker.Item label="Select Category" value="" />
					{categories.map((categoryItem, index) => (
						<Picker.Item key={index} label={categoryItem} value={categoryItem} />
					))}
				</Picker>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Condition</Text>
				<Picker
					style={styles.input}
					selectedValue={condition}
					onValueChange={(itemValue) => setCondition(itemValue)}
				>
					<Picker.Item label="Select Condition" value="" />
					{conditions.map((conditionItem, index) => (
						<Picker.Item key={index} label={conditionItem} value={conditionItem} />
					))}
				</Picker>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Description</Text>
				<TextInput
					style={[styles.input, styles.multilineInput]}
					placeholder="Enter description"
					onChangeText={setDescription}
					value={description}
					multiline
				/>
			</View>
			<Button
				buttonStyle={styles.submitButton}
				titleStyle={styles.submitButtonText}
				title="Add Book"
				onPress={handleSubmit}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
		flex: 1,
	},

	inputContainer: {
		marginBottom: 20,
	},

	label: {
		fontSize: 16,
		marginBottom: 5,
		color: "#333",
	},

	input: {
		height: 50,
		borderRadius: 8,
		borderColor: "#ccc",
		borderWidth: 1,
		paddingHorizontal: 15,
		fontSize: 16,
		color: "#333",
	},

	multilineInput: {
		height: 100,
		paddingTop: 10,
	},

	submitButton: {
		backgroundColor: "#4CAF50",
		borderRadius: 8,
		paddingVertical: 15,
	},

	submitButtonText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
	},
});

export default CreateListing;

