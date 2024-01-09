import { Text, StyleSheet, Pressable, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, React } from 'react';
import supabase from '../config/supabaseClient';

export default function AvailableListings({ route }) {
    const navigation = useNavigation();
    const { session, listing } = route.params;
    const [multipleListings, setMultipleListings] = useState([]);

    useEffect(() => {
        fetchMultipleListings(listing.book_title).then(result => {
            setMultipleListings(result);
        });
    }, [listing.book_title]);

    async function fetchMultipleListings(book_title) {
        const { data, error } = await supabase.from('Listings').select('*').eq('book_title', book_title).neq('user_id', session.user.id);

        if (error) {
            console.log(error);
            return [];
        }
        return data;
    }

    return (
        <View>
            {multipleListings.map(listing => (
                <View key={listing.book_id}>
                    <Text>{listing.book_title}</Text>
                    <Image
                        style={styles.bookCard}
                        source={{ uri: listing.img_url }}
                    />
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ListedBook', { listing: listing });
                        }}
                        style={styles.button}
                    >
                        <Text>This button takes you to an individual book page to make an offer.</Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

{
    /* <Image style={styles.bookCard} source={{ uri: listing.img_url }} />
      <Pressable
        onPress={() => {
          navigation.navigate("ListedBook",
          {listing: listing})
        }}
        style={styles.button}
      >
        <Text>This button takes you to an individual book page to make an offer.</Text>
      </Pressable>
      <Text>
        This is going to be a list of cards, each card will be a link to an
        individual book page
      </Text>
    </View> */
}
{
    /* );
} */
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    bookCard: {
        height: 150,
        resizeMode: 'contain',
    },
});
