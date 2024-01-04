import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";

const CreateListing = ({ route }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	// const { session } = route.Params

	// option to post listing V
	// option to edit listing
	// option to delete listing

	console.log(route.Params)

	const handleSubmit = async () => {
		// async function getData() {
		// 	const { data, error } = await supabase.auth.getSession();
		// 	const { session } = data;
		// 	console.log(session.user.user_metadata.username, "session");
		// }
		const { data, error } = await supabase
			.from("Listings")
			.insert([
				{
					book_title: title,
					author: author,
					Category: category,
					description: description,
				},
			])
			.select();
		getData();

		if (error) {
			console.error("Error inserting data: ", error);
			return;
		}
		console.log("Data inserted: ", data);
	};

	return (
		<View>
			<TextInput placeholder="Title" onChangeText={setTitle} value={title} />
			<TextInput placeholder="Author" onChangeText={setAuthor} value={author} />
			<TextInput
				placeholder="Category"
				onChangeText={setCategory}
				value={category}
			/>
			{/* <TextInput
				placeholder="Condition"
				onChangeText={setCondition}
				value={condition}
			/> */}
			<TextInput
				placeholder="Description"
				onChangeText={setDescription}
				value={description}
				multiline
			/>
			<Button title="Submit" onPress={handleSubmit} />
		</View>
	);
};

export default CreateListing;
