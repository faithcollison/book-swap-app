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
  ScrollView,
  SafeAreaView,
  Input,
  Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
const screenHeight = Dimensions.get("window").height;
import SwitchSelector from "react-native-switch-selector";

const Search_Existing_Book = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [title, setTitle] = useState("");
  const [googleBookId, setGoogleBookId] = useState("")
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState("title");

  let totalPages = Math.ceil(totalItems / 20);
  const api = process.env.GOOGLE_BOOKS_API_KEY;

  const handleSearch = async () => {
    let apiSearch;
    if (searchTerm !== "") {
      if (searchType === "title") {
        const apiSearchTitle = searchTerm.replace(/\s/g, "+");
        apiSearch = `https://www.googleapis.com/books/v1/volumes?q=${apiSearchTitle}&startIndex=${
          page * 20
        }&maxResults=20&key=${api}`;
      } else if (searchType === "author") {
        const apiSearchAuthor = searchTerm.replace(/\s/g, "+");
        apiSearch = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${apiSearchAuthor}&startIndex=${
          page * 20
        }&maxResults=20&key=${api}`;
      }
    }
    try {
      const response = await fetch(apiSearch);
      const data = await response.json();
      if (data.items === undefined) {
        navigation.navigate("CreateListing");
      }
      if (data.totalItems <= page * 20 + 20) {
        setHasMore(false);
      }
      setTotalItems(data.totalItems);
      const filtered = data.items.filter(
        (book) => book.volumeInfo.language === "en"
      );
      setSearchResults(filtered);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setGoogleBookId(book.id)
    setTitle(book.volumeInfo.title);
    setAuthors(book.volumeInfo.authors?.join(", ") || "");
    setDescription(book.volumeInfo.description);
    setImgUrl(
      book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.smallThumbnail
        : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg"
    );
  };

  useEffect(() => {
    if (title || authors) {
      navigation.navigate("CreateListing", {
        currTitle: title,
        authors: authors,
        currDescription: description,
        imgUrl: imgUrl,
        navigation: navigation,
        book_id: googleBookId
      });
    }
  }, [title, authors]);


  //Leave this comment in for future. Decision was made to map this instead of FlatList as FlatList refused to rerender when data/extradata was updated.
  //This was the only solution I could come up with

  return (
    <ScrollView>
      <View style={styles.wrapperContainer}>
        <Text> ADD A NEW BOOK! </Text>
        <SwitchSelector
          options={[
            { label: "Title", value: "title" },
            { label: "Author", value: "author" },
          ]}
          initial={0}
          onPress={(value) => setSearchType(value)}
          styles={{
            borderColor: "#46bdbf",
            backgroundColor: "#9003fc",
            buttonColor: "#f1f1f1",
            selectedLabelColor: "#FFFFFF",
            unselectedLabelColor: "#FFFFFF",
          }}
        />
        <SearchBar
          placeholder="Search for book here.."
          onChangeText={setSearchTerm}
          value={searchTerm}
          onSubmitEditing={handleSearch}
        />
        <Button title="Search" onPress={handleSearch} />
        <Button
          title="Add book manually"
          onPress={() => navigation.navigate("CreateListing")}
        />
        <ScrollView>
          <View style={styles.marginBottom}>
            <View style={styles.container}>
              {searchResults.map((item) => {
                console.log(item)
                return (
                  <View style={styles.item} key={item.id}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSelectBook(item);
                      }}
                    >
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
                        <Text style={styles.bookTitle}>
                          {item.volumeInfo.title}
                        </Text>
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
                );
              })}
              {hasSearched && (
                <View style={styles.button}>
                  <Button
                    title="Previous"
                    onPress={() => {
                      setPage((prevPage) => prevPage - 1);
                    }}
                    disabled={page === 1}
                  />
                  <Text>Page: {page}</Text>
                  <Button
                    title="Next"
                    onPress={() => {
                      setPage((prevPage) => prevPage + 1);
                    }}
                    disabled={page === totalPages}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: screenHeight * 0.11,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
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
