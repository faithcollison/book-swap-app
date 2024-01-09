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

//   console.log(userData);

  return (
    <View>
      {userData.map((swap) => {
        return (
          <View key={swap.pending_swap_id}>
            <Text>
              {" "}
              You swapped {swap.user1_book_title} with {swap.user2_book_title} on {swap.offer_date}{" "}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
export default SwapHistory;
