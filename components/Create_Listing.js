import React, { useState, useEffect } from "react";
import {Alert, Button, View, Text, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import { SearchBar } from 'react-native-elements';
import Form from './Form'
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
console.log(apiKey, "api key")

const CreateListing = ({navigation}) => {
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const [selectedBook, setSelectedBook] = useState({}) 
	const [title, setTitle] = useState("");
	const [authors, setAuthors] = useState("");
	const [description, setDescription] = useState("");
	const [imgUrl, setImgUrl] = useState("")


	const handleSearch = async () => {
		try {
		  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=AIzaSyBMR5p0dW3LjnGfX74FAk5GGeB2veYACIk`);
		  const data = await response.json();
		  setSearchResults(data.items)
		  // if no results => render manual form to fill in
		  // otherwise :
		  return data
		} catch (error) {
		  console.error(error);
		}
	};

	const handleSelectBook = (book) => {
		setSelectedBook(book)
		setTitle(book.volumeInfo.title);
		setAuthors(book.volumeInfo.authors?.join(", ") || "");
		setDescription(book.volumeInfo.description);
		setImgUrl(book.volumeInfo.imageLinks.smallThumbnail? book.volumeInfo.imageLinks.smallThumbnail: "" )
	}

	useEffect(() => {
		if (title && authors && description) {
		 navigation.navigate("Form", {title: title, authors: authors, description: description, imgUrl: imgUrl });
		}
	   }, [title, authors, description, imgUrl]);
	
	return (
		<View>
			<SearchBar 
			placeholder="Search for book here.."
			onChangeText={setSearchQuery}
			value={searchQuery}
			onSubmitEditing={handleSearch}
			/>
			<FlatList 
				data={searchResults}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) => (
					<TouchableOpacity onPress={() => handleSelectBook(item)}>
						<View >
							<Text>{item.volumeInfo.title}</Text>
							<Text>WRITTEN BY: {item.volumeInfo.authors && item.volumeInfo.authors.join(', ')}</Text>
							<Text>PUBLISHED: {item.volumeInfo.publishedDate}</Text>
							<Text>ABOUT: {item.volumeInfo.description}</Text>
							{item.volumeInfo.imageLinks.smallThumbnail? <Image source={{uri: item.volumeInfo.imageLinks.smallThumbnail}} style={{width: 200, height: 200}}/> : null}
       					</View>
					</TouchableOpacity>
				)}
			/>
		</View>
			
	);
};


export default CreateListing;