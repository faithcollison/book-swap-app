import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text, Dimensions, Image, ScrollView } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import supabase from "../config/supabaseClient";

const screenWidth = Dimensions.get('window').width;

export default function BookList ({ categoryName }) {
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        async function getBooks (categoryName) {
            const {data, error} = await supabase
            .from('Listings')
            .select('*')
            .eq('Category', categoryName)
            
            setBookList(data);
        }
        
        getBooks(categoryName)
    }, [])



    return (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderTitle}>{categoryName}</Text>
                <Pressable >
                    <Text>See More</Text>
                </Pressable>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} style={styles.categoryList} horizontal={true}>
                {bookList.map(listing => {
                    return <Image key={listing.img_url} style={styles.bookCard} source={{uri: listing.img_url}} />
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {
        alignItems: "center"
    },
    categoryHeader: {
        flexDirection: 'row',
        flex: 1,
        width: screenWidth * 0.9,
        alignItems: "center",
        justifyContent: "space-between",
    },
    categoryList: {
        width: screenWidth,
        flexDirection: 'row',
        marginTop: 10,
    },
    bookCard: {
        width: screenWidth / 3,
        height: 150,
        resizeMode: 'contain',
    }
})