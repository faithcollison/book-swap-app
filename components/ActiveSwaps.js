import { React, useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable, Platform } from 'react-native';
import SwapCard from './SwapCard';

const screenHeight = Dimensions.get('screen').height;

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
        console.log(data[0], '<<<<<')
        setSentSwaps(data.filter(swap => swap.user1_listing_id !== userID && !swap.user2_listing_id));
        setReceivedSwaps(data.filter(swap => swap.user1_listing_id === userID && !swap.user2_listing_id));
        setActiveSwaps(data.filter(swap => swap.user1_listing_id && swap.user2_listing_id));
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
        <ScrollView style={Platform.OS === 'ios'
            ? styles.pageContainer
            : {...styles.pageContainer, ...styles.webFix}
        }>
            <Text style={styles.title}>Active Swaps</Text>

            <Text style={styles.heading}>New Swap Requests</Text>
            {receivedSwaps.length ? 
            receivedSwaps.map(swap => <SwapCard swap={swap} type={'received'}/>) :
            <Text style={styles.antiText}>You have no swap requests!</Text>}
            

            <Text style={styles.heading}>Active Swaps</Text>
            {activeSwaps.length ? 
            activeSwaps.map(swap => <SwapCard swap={swap} type={'active'}/>) :
            <Text style={styles.antiText}>You have no active swap negotiations!</Text>}

            <Text style={styles.heading}>Sent Swap Requests</Text>
            {sentSwaps.length ? 
            sentSwaps.map(swap => <SwapCard swap={swap} type={'sent'}/>) :
            <Text style={styles.antiText}>You have no sent swap requests pending!</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: '#272727',
        padding: 16,
    },
    webFix: {
        marginBottom: screenHeight * 0.09,
    },
    title: {

    }
});

export default ActiveSwaps;
