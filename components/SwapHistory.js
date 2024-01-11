import { React, useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable } from 'react-native';

const SwapHistory = ({ session }) => {
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (session) {
            setUserID(session.user.id);
        }
    }, [session]);

    const getSwapInfo = async () => {
        const { data, error } = await supabase.from('Swap_History').select('*').or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
        setUserData(data);
    };
   
    async function getBookOwner() {
        const { data, error } = await supabase.from('Users').select('username').eq('user_id', userID);
        setUserName(data[0].username);
    }

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
            <Text style={styles.headerText}>Swap History</Text>
            {userData.map(swap => (
                <Pressable
                    key={swap.pending_swap_id}
                    style={styles.textContainer}
                    onPress={() => {
                        // Add navigation logic if needed
                    }}
                >
                    <View>
                        <Text style={styles.textStyling}>
                            {`You swapped `}
                            <Text style={[styles.swapText]}>{swap.user1_book_title}</Text>
                            {` with `}
                            <Text style={[styles.swapText]}>{swap.user2_book_title}</Text>
                            {` on ${formatDate(swap.offer_date)}`}
                        </Text>
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
    headerText: {
        fontFamily: 'JosefinSans_400Regular',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'white',
    },
    swapText: {
        fontFamily: 'JosefinSans_400Regular',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'white',
    },
    textContainer: {
        display: 'flex',
        backgroundColor: '#06A77D',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 8,
        marginTop: 8,
        padding: 10,
    },
    textStyling: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'JosefinSans_400Regular',
    },
});

export default SwapHistory;
