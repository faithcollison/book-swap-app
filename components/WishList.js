import { React, useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable } from 'react-native';

const WishList = ({ session }) => {
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (session) {
            getWishList();
            setUsername(session?.user?.user_metadata?.username);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getWishList(username);
        setRefreshing(false);
    }, [username]);

    const getWishList = async username => {
        const { data, error } = await supabase.from('Users').select('wishlist').eq('user_id', session.user.id).limit(1).single();

        if (error) {
            console.log(error);
        } else {
            setBooks(data.wishlist || []);
        }
    };

    const removeFromWishList = async book => {
        const { data, error } = await supabase
            .from('Users')
            .update({ wishlist: books.filter(item => item !== book) })
            .select('wishlist')
            .eq('user_id', session.user.id)
        if (error) {
            console.log(error);
        } else {
            // console.log(data)
            setBooks(data[0].wishlist);
        }
    };
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View>
                <Text style={styles.header}>Wishlist</Text>
                {books.map(book => (
                    <View
                        key={book}
                        style={styles.listContainer}
                    >
                        <Text style={styles.titleText}>{book}</Text>
                        <Pressable onPress={() => removeFromWishList(book)}>
                            <Text>Remove</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    listContainer: {
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#e3e3e3',
        padding: 16,
        borderRadius: 8,
        width: Dimensions.get('window').width - 32,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
export default WishList;
