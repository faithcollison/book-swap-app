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
  };

  return (
    <ScrollView style={styles.container}>
      {userData.map((swap) => (
        <Pressable
          key={swap.pending_swap_id}
          style={styles.item}
          onPress={() => {
            // Add navigation logic if needed
          }}
        >
          <View>
            <Text style={styles.text}>
              {"You swapped "}
              <Text style={styles.highlightedText}>
                {swap.user1_book_title}
              </Text>
              {" with "}
              <Text style={styles.highlightedText}>
                {swap.user2_book_title}
              </Text>
              {" on "}
              <Text style={styles.text}>
                {formatDate(swap.offer_date)}
              </Text>
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    display: "flex",
    margin: "auto",
    borderColor: "gray",
    borderWidth: 2,
    width: "95%",
    borderRadius: 12,
    margin: 10,
    padding: 10,
  },
  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  text: {
    fontFamily: "VollkornSC_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
  highlightedText: {
    color: "#06A77D",
    fontFamily: "VollkornSC_400Regular",
    fontSize: 16,
    textAlign: "left",
  },
});

export default SwapHistory;
