import { React, useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable, Platform } from 'react-native';
import SwapCard from './SwapCard';

const {height, width} = Dimensions.get('screen');

const ActiveSwaps = ({ session }) => {
    const navigation = useNavigation();
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState([]);

    const [sentSwaps, setSentSwaps] = useState([]);
    const [receivedSwaps, setReceivedSwaps] = useState([]);
    const [activeSwaps, setActiveSwaps] = useState([]);


    useEffect(() => {
        if (session) {
            setUserID(session.user.id);
        }
    }, [session]);

    const getSwapInfo = async () => {
        const { data, error } = await supabase
            .from('Pending_Swaps')
            .select('*')
            .or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
        setUserData(data);
        setSentSwaps(data.filter(swap => swap.user1_id !== userID && !swap.user2_listing_id));
        setReceivedSwaps(data.filter(swap => swap.user1_id === userID && !swap.user2_listing_id));
        setActiveSwaps(data.filter(swap => swap.user1_listing_id && swap.user2_listing_id));
    };

    useEffect(() => {
        if (userID) {
            getSwapInfo();
        }
    }, [userID]);

    return (
        <ScrollView style={Platform.OS === 'ios'
            ? styles.pageContainer
            : {...styles.pageContainer, ...styles.webFix}
        }>
            <Text style={styles.title}>Active Swaps</Text>
            <View style={styles.hr} />

            <View style={styles.section}>
                <Text style={styles.heading}>New Swap Requests</Text>
                {receivedSwaps.length ? 
                receivedSwaps.map(swap => {
                    return <SwapCard swap={swap} type={'received'}/>
                }) :
                <Text style={styles.antiText}>You have no new swap requests!</Text>}
            </View>
            
            <View style={styles.section}>
                <Text style={styles.heading}>Active Swaps</Text>
                {activeSwaps.length ? 
                activeSwaps.map(swap => <SwapCard swap={swap} type={swap.user1_id === userID ? 'activeReceived' : 'activeSent'} userID={userID}/>) :
                <Text style={styles.antiText}>You have no active swap negotiations!</Text>}
            </View>

            <View style={styles.section}>
                <Text style={styles.heading}>Sent Swap Requests</Text>
                {sentSwaps.length ? 
                sentSwaps.map(swap => <SwapCard swap={swap} type={'sent'}/>) :
                <Text style={styles.antiText}>You have no sent swap requests pending!</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: '#272727',
        width: width,
        flex: 1,
    },
    webFix: {
        marginBottom: height * 0.09,
    },
    title: {
        width: width * 0.9,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        marginVertical: 15,
    },
    heading: {
        width: width * 0.9,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginBottom: 5,
    },
    section: {
        marginVertical: 25,
    },
    hr: {
        width: width * 0.9,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: 25,
    },
});

export default ActiveSwaps;
