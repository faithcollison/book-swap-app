import { React, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Text, View, Image } from 'react-native';

const WishList = ({ session }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (session) getWishList(session?.user?.user_metadata?.username);
    }, []);

    const getWishList = async username => {
        const { data, error } = await supabase.from('Users').select('wishlist').eq('username', username).limit(1).single();
        // .eq('username', username).order('date_posted', { ascending: false })

        if (error) {
            alert(error);
        } else {
            setBooks(data.wishlist);
        }
    };
    return (
        <View>
            <Text>WishList</Text>
            {books.map(book => (
                <View key={book}>
                    <Text>{book}</Text>
                    
                </View>
            ))}
        </View>
    );
};
export default WishList;
