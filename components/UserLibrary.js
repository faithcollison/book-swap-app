import { React, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Text, View, Image } from 'react-native';

const UserLibrary = ({ session }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (session) getListings(session?.user?.user_metadata?.username);
    }, []);

    async function getListings(username) {
        const { data, error } = await supabase.from('Listings').select('*').eq('username', username).order('date_posted', { ascending: false })

        if (error) {
            alert(error);
        } else {
            setBooks(data);
        }
    }
    return (
        <View>
            <Text>User Library</Text>
            {books.map(book => (
                <View key={book.book_id}>
                    <Text>{book.book_title}</Text>
                    <Text>{book.author}</Text>
                    <Image source={{uri: book.img_url}} style={{ width: 100, height: 100 }} />
                    <Text>{book.description}</Text>
                    <Text>{book.Category}</Text>
                </View>
            ))}
        </View>
    );
};

export default UserLibrary;
