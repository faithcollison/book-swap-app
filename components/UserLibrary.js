import { React, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Text, View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';

const UserLibrary = ({ session }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (session) getListings(session?.user?.user_metadata?.username);
    }, []);

    async function getListings(username) {
        const { data, error } = await supabase.from('Listings').select('*').eq('username', username).order('date_posted', { ascending: false });

        if (error) {
            alert(error);
        } else {
            setBooks(data);
        }
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>User Library</Text>
            {books.map(book => (
                <View
                    key={book.book_id}
                    style={styles.bookContainer}
                >
                    <Text style={styles.titleText}>{book.book_title}</Text>
                    <Text style={styles.authorText}>{book.author}</Text>
                    <Image
                        source={{ uri: book.img_url }}
                        style={styles.image}
                    />
                    <Text style={styles.descriptionText}>{book.description}</Text>
                    <Text style={styles.categoryText}>{book.Category}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bookContainer: {
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#e3e3e3',
        padding: 16,
        borderRadius: 8,
        width: Dimensions.get('window').width - 32,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    authorText: {
        fontSize: 16,
        marginBottom: 8,
    },
    image: {
        alignItems: 'center',
        width: '50%',
        height: 290,
        marginBottom: 8,
        borderRadius: 4,
    },
    descriptionText: {
        fontSize: 14,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserLibrary;
