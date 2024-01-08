import React, { useState } from "react";
import { View, TextInput, Text, Platform, ScrollView} from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import { StyleSheet } from "react-native-web";
import DropDownPicker from "react-native-dropdown-picker";

const CreateListing = ({ route, navigation }) => {
  const { currTitle, authors, currDescription, imgUrl } = route.params;

  const [title, setTitle] = useState(currTitle);
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

  return (
    // <ScrollView>
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
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  inputContainer: {
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
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
  formElementWithMargin: {
    marginTop: 200, // adjust this value as needed
  },
});

export default CreateListing;
