import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Pressable,
} from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export const Search_Existing_Book = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [title, setTitle] = useState("");
  const [googleBookId, setGoogleBookId] = useState("");
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
    setGoogleBookId(book.id);
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
        book_id: googleBookId,
      });
    }
  }, [title, authors]);

  return (
    <ScrollView style={styles.scrollview}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Find a Book</Text>
          <Text style={styles.sortBy}>Sort by</Text>
          <SegmentedButtons
            value={searchType}
            onValueChange={setSearchType}
            buttons={[
              { label: "Title", value: "title" },
              { label: "Author", value: "author" },
            ]}
            style={{
              width: "60%",
            }}
          />
          <Searchbar
            placeholder="Search for a book here..."
            onChangeText={setSearchTerm}
            value={searchTerm}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
          />
          <Pressable
            title="Search"
            onPress={handleSearch}
            style={styles.button}
          >
            <Text
              style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}
            >
              Search
            </Text>
          </Pressable>
          <Pressable
            title="Add book manually"
            onPress={() => navigation.navigate("CreateListing")}
            style={styles.button}
          >
            <Text
              style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}
            >
              Add book manually
            </Text>
          </Pressable>
          {hasSearched && totalPages > 1 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              ListFooterComponent={() => (
                <View style={styles.footerContainer}>
                  <Pressable
                    onPress={() => setPage((prevPage) => prevPage - 1)}
                    disabled={page === 1}
                    style={styles.paginationButtons}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {" "}
                      Previous{" "}
                    </Text>
                  </Pressable>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "JosefinSans_400Regular",
                      fontSize: 13,
                    }}
                  >
                    {" "}
                    Page: {page}{" "}
                  </Text>
                  <Pressable
                    onPress={() => setPage((prevPage) => prevPage + 1)}
                    disabled={page === totalPages}
                    style={styles.paginationButtons}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {" "}
                      Next{" "}
                    </Text>
                  </Pressable>
                </View>
              )}
              renderItem={({ item }) => (
                <LinearGradient
                  colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgba(169, 169, 169, 0.15)",
                    padding: 16,
                    width: Dimensions.get("window").width - 32,
                    borderRadius: 30,
                    overflow: "hidden",
                    marginBottom: 25,
                  }}
                >
                  <Text style={styles.titleText}>{item.volumeInfo.title}</Text>
                  <Text style={styles.authorText}>
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
                    style={styles.image}
                  />
                  <Pressable
                    onPress={() => handleSelectBook(item)}
                    style={styles.selectButton}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "JosefinSans_400Regular",
                        fontSize: 18,
                        marginVertical: 10,
                      }}
                    >
                      Select Book
                    </Text>
                  </Pressable>
                </LinearGradient>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#272727",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Dimensions.get("window").height * 0.09,
    backgroundColor: "#272727",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    marginTop: 20,
    marginBottom: 40,
  },
  sortBy: {
    textAlign: "left",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10,
    color: "white",
  },
  searchbar: {
    width: "80%",
    marginBottom: 20,
    marginTop: 50,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    fontFamily: "JosefinSans_400Regular",
    color: "white",
    paddingTop: 10,
    paddingBottom: 5,
  },
  authorText: {
    fontSize: 15,
    color: "white",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    paddingBottom: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  image: {
    alignItems: "center",
    height: 180,
    width: 120,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    marginTop: 7,
    marginBottom: 7,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 45,
  },
  paginationButtons: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 45,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 45,
  },
  scrollview: {
    backgroundColor: "#272727",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
