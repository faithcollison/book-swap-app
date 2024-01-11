import { React, useCallback, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
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

const ActiveSwaps = ({ session }) => {
  const navigation = useNavigation();
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (session) {
      setUserID(session.user.id);
    }
  }, [session]);

  const getSwapInfo = async () => {
    const { data, error } = await supabase
      .from("Pending_Swaps")
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
  };

  return (
    <ScrollView>
      {userData.map((swap) => (
        <Pressable
          key={swap.pending_swap_id}
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapNegotiationPage", {
              user1_book: swap,
              user2_book: null,
              info: null,
              session,
            });
          }}
        >
          <View>
            {swap.user1_id === session.user.id ? (
              <Text>
                <span style={{ fontWeight: "bold" }}>
                  {swap.user2_username}
                </span>
                <Text> </Text>
                would like to create a swap for
                <Text> </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {swap.user1_book_title}
                </Text>
                <Text>{` on ${formatDate(swap.offer_date)} `}</Text>
              </Text>
            ) : (
              <Text>
                <span style={{ fontWeight: "bold" }}>
                  <Text>You</Text>
                </span>
                <Text> offered to swap</Text>
                <Text
                  style={{ fontWeight: "bold" }}
                >{` ${swap.user2_book_title} `}</Text>
                <Text>for</Text>
                <Text>{` ${swap.user1_book_title}`}</Text>
                <Text>{` on ${formatDate(swap.offer_date)} `}</Text>
              </Text>
            )}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    margin: "auto",
    borderColor: "gray",
    borderWidth: 2,
    width: "80%",
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 8,
    padding: 10,
  },
});

export default ActiveSwaps;
