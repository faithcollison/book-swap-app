
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
console.log(userData)

async function getBookOwner() {
  const { data, error } = await supabase
    .from("Users")
    .select("username")
    .eq("user_id", userID);
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
        <ScrollView style={swapStyles.pageContainer}>
          {userData.map(swap => (
            <Pressable
              key={swap.pending_swap_id}
              style={[swapStyles.container, swapStyles.textContainer]}
              onPress={() => {
                // Add navigation logic if needed
              }}
            >
              <View>
                <Text style={swapStyles.textStyling}>
                  {`You swapped `}
                  <Text style={[swapStyles.hightlightText]}>{swap.user1_book_title}</Text>
                  {` with `}
                  <Text style={[swapStyles.hightlightText]}>{swap.user2_book_title}</Text>
                  {` on ${formatDate(swap.offer_date)}`}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      );
    };
    
    const swapStyles = StyleSheet.create({
      pageContainer: {
        backgroundColor: '#272727',
        padding: 16,
      },
      container: {
        display: 'flex',
        backgroundColor: '#464646',
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 8,
        marginTop: 8,
        padding: 10,
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
        fontFamily: 'JosefinSans_400Regular',
      },
      hightlightText: {
        color: '#06A77D',
        fontSize: 20,
        fontFamily: 'JosefinSans_400Regular',
      },
    });
    
    export default SwapHistory;