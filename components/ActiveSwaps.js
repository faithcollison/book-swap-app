import { React, useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable } from 'react-native';

const ActiveSwaps = ({ session }) => {
    const navigation = useNavigation();
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (session) {
            setUserID(session.user.id);
        }
    }, [session]);

    const getSwapInfo = async () => {
        const { data, error } = await supabase.from('Pending_Swaps').select('*').or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
        setUserData(data);
    };

    useEffect(() => {
        if (userID) {
            getSwapInfo();
        }
    }, [userID]);

    const formatDate = date => {
        return date.split('T')[0];
    };

    return (
        <ScrollView style={styles.pageContainer}>
            {userData.map(swap => (
                <Pressable
                    key={swap.pending_swap_id}
                    style={[styles.container, styles.textContainer]}
                    onPress={() => {
                        navigation.navigate('SwapNegotiationPage', {
                            user1_book: swap,
                            user2_book: null,
                            info: null,
                            session,
                        });
                    }}
                >
                    <View>
                        {swap.user1_id === session.user.id ? (
                            <View>
                                <Text style={styles.textStyling}>
                                    <Text style={[styles.hightlightText]}>{swap.user2_username}</Text>
                                    <Text> </Text>
                                    would like to create a swap for
                                    <Text> </Text>
                                    <Text style={[styles.hightlightText]}>{swap.user1_book_title}</Text>
                                    <Text>{` on ${formatDate(swap.offer_date)} `}</Text>
                                </Text>
                                <Image
                                    source={{ uri: swap.user2_book_imgurl }}
                                    style={styles.bookImage}
                                />
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.textStyling}>
                                    <Text>
                                        <Text style={[styles.hightlightText]}>You</Text>
                                    </Text>
                                    <Text> offered to swap</Text>
                                    <Text>{` ${swap.user2_book_title} `}</Text>
                                    <Text>for</Text>
                                    <Text style={[styles.hightlightText]}>{` ${swap.user1_book_title}`}</Text>
                                    <Text>{` on ${formatDate(swap.offer_date)} `}</Text>
                                </Text>
                                <View
                                style={styles.imageRow}>
                                <Image
                                    source={{ uri: swap.user2_book_imgurl }}
                                    style={styles.bookImage}
                                />
                                <Image
                                    source={{ uri: swap.user1_book_imgurl }}
                                    style={styles.bookImage}
                                />
                            </View>
                            </View>
                        )}
                    </View>
                </Pressable>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: '#272727',
        padding: 16,
    },
    textContainer: {
        display: 'flex',
        backgroundColor: '#464646',
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 8,
        marginTop: 8,
        padding: 10,
    },
    textStyling: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'VollkornSC_400Regular',
    },
    hightlightText: {
        color: '#06A77D',
        fontSize: 20,
        fontFamily: 'VollkornSC_400Regular',
    },
    bookImage: {
        width: 50,
        height: 75,
        borderRadius: 7,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust as needed
        marginTop: 8, // Add some space between text and images
    },
});

export default ActiveSwaps;
