import { React, useCallback, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  Pressable,
} from "react-native";

const SwapHistory = ({ session }) => {
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (session) {
      setUserID(session.user.id);
    }
  }, [session]);

  const getSwapInfo = async () => {
    const { data, error } = await supabase
      .from("Swap_History")
      .select("*")
      .or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
    setUserData(data);
  };

  useEffect(() => {
    if (userID) {
      getSwapInfo();
    }
  }, [userID]);

  const formatDate = (date) => {
    return date.split("T")[0];
  }

return (
    <ScrollView>
      {userData.map((swap) => (
        <Pressable
          key={swap.pending_swap_id}
          style={styles.container}
          onPress={() => {
            // Add navigation logic if needed
          }}
        >
          <View>
            <Text>{`You swapped ${swap.user1_book_title} with ${swap.user2_book_title} on ${formatDate(swap.offer_date)}`}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    margin: 'auto',
    borderColor: 'gray',
    borderWidth: 2,
    width: '80%',
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 8,
    padding: 10,
  },
});

export default SwapHistory;
