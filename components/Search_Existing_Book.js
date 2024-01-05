import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
const screenHeight = Dimensions.get('window').height;

const Search_Existing_Book = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  let totalPages = Math.ceil(totalItems / 20);

  const api = process.env.GOOGLE_BOOKS_API_KEY;

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=${
          page * 20
        }&maxResults=20&key=${api}`
      );
      const data = await response.json();
      setTotalItems(data.totalItems);
      setSearchResults(data.items);
      if (data.totalItems <= page * 20 + 20) {
        setHasMore(false);
      }
      // if no results => render manual form to fill in
      // otherwise :
      //   return data
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setTitle(book.volumeInfo.title);
    setAuthors(book.volumeInfo.authors?.join(", ") || "");
    setDescription(book.volumeInfo.description);
    setImgUrl(
      book.volumeInfo.imageLinks.smallThumbnail
        ? book.volumeInfo.imageLinks.smallThumbnail
        : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg"
    );
  };

  useEffect(() => {
    if (title || authors || description) {
      navigation.navigate("CreateListing", {
        currTitle: title,
        authors: authors,
        currDescription: description,
        imgUrl: imgUrl,
        navigation: navigation,
      });
    }
  }, [title, authors, description, imgUrl]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    handleSearch();
  };

  return (
    <View style={styles.wrapperContainer}>
      <Text> ADD A NEW BOOK! </Text>
      <Text> Search for title here: </Text>
      <SearchBar
        placeholder="Search for book here.."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.marginBottom}>
        <View style={styles.container}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleSelectBook(item)}>
                  <View
                    style={[
                      styles.container,
                      {
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: "black",
                      },
                    ]}
                  >
                    <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
                    <Text style={styles.author}>
                      Written by{" "}
                      {item.volumeInfo.authors &&
                        item.volumeInfo.authors.join(", ")}
                    </Text>
                    <Image
                      source={
                        item.volumeInfo.imageLinks !== undefined
                          ? { uri: item.volumeInfo.imageLinks.smallThumbnail }
                          : {
                              uri: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
                            }
                      }
                      style={[styles.image, { width: 100, height: 100 }]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.button}>
            {/* <Button
              title="Load More"
              onPress={() => {
                setPage((prevPage) => prevPage + 1);
                handleSearch();
              }}
              disabled={!hasMore}
            /> */}
            <Button
              title="Previous"
              onPress={() => {
                setPage((prevPage) => prevPage - 1);
                handleSearch()
              }}
              disabled={page === 1}
            />
            <Text>Page: {page}</Text>
            <Button
              title="Next"
              onPress={() => {
                setPage((prevPage) => prevPage + 1);
                handleSearch()
              }}
              disabled={page === totalPages}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
{
  /* {Array.from({ length: Math.ceil(totalItems / 20) }).map((curr, i) => (
  <Button
    key={i}
    title={`${i + 1}`}
    onPress={() => handlePageChange(i + 1)}
  />
))} */
}
const styles = StyleSheet.create({
  // wrapperContainer: {
  //   marginBottom: screenHeight * 0.09
  // },
  marginBottom: {
    marginBottom: screenHeight * 0.09
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    // marginBottom: screenHeight * 0.09
  },
  item: {
    flex: 1,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    margin: 0,
  },
  bookTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Arial",
  },
  author: {
    fontSize: 16,
  },
  image: {
    margin: 20,
    borderRadius: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10, // add some padding
    paddingVertical: 20, // add some vertical padding
  },
});

export default Search_Existing_Book;
