import React, { useState } from "react";
import { View, TextInput, Text, Platform, ScrollView} from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StyleSheet } from "react-native-web";
import DropDownPicker from "react-native-dropdown-picker";
import { useFonts } from "expo-font";
import {
	VollkornSC_400Regular,
	Bellefair_400Regular,
	CormorantGaramond_400Regular,
	JosefinSans_400Regular,
} from "@expo-google-fonts/dev";

const CreateListing = ({ route, navigation }) => {
  const { currTitle, authors, currDescription, imgUrl, book_id } = route.params;

  const [title, setTitle] = useState(currTitle);
  const [googleBookID, setGoogleBookID] = useState(book_id)
  const [author, setAuthor] = useState(authors);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState(currDescription);
  const [currImgUrl, setcurrImgUrl] = useState(imgUrl);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  //   setTitle(currTitle);
  //   setAuthor(authors);
  //   setDescription(currDescription);

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
          google_book_id: googleBookID, 
          author: author,
          Category: category,
          condition: condition,
          description: description,
          img_url: currImgUrl,
          no_of_wishlists: 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data: ", error);
      return;
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
      <ScrollView style={styles.container}>
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
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter description"
            onChangeText={setDescription}
            value={description}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categories.map((categoryItem, index) => ({
              label: categoryItem,
              value: categoryItem,
              key: index,
            }))}
            onOpen={() => setCategoryOpen(true)}
            onClose={() => setCategoryOpen(false)}
            setValue={setCategory}
            style={{...styles.input, zIndex: 1}}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>
        <View style={categoryOpen ? styles.formElementWithMargin : styles.inputContainer}>
          <Text style={styles.label}>Condition</Text>
          <DropDownPicker
            open={conditionOpen}
            value={condition}
            items={conditions.map((conditionItem, index) => ({
              label: conditionItem,
              value: conditionItem,
              key: index,
            }))}
            onOpen={() => setConditionOpen(true)}
            onClose={() => setConditionOpen(false)}
            setValue={setCondition}
            style={{...styles.input, zIndex: 1}}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>
      
        <View style={conditionOpen ? styles.formElementWithMargin : styles.inputContainer}>
          <Button
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitButtonText}
            title="Add Book"
            onPress={() => {
              handleSubmit();
              navigation.navigate("Home");
            }}
          />
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#272727",
    flex: 1,
  },

  inputContainer: {
    marginBottom: 30,
  },

  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
    fontFamily: 'JosefinSans_400Regular'
  },

  input: {
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 14,
    backgroundColor: '#EBEBEB'
  },

  multilineInput: {
    height: 100,
    paddingTop: 10,
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: "#06A77D",
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 20,
  },

  submitButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  formElementWithMargin: {
    marginTop: 200,
  },
});

export default CreateListing;
