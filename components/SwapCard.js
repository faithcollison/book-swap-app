import { StyleSheet, View } from "react-native";

export default function SwapCard () {
    return (
        <View style={{height: 10, width: 20, borderWidth: 2,}}/>
    )
}

const styles = StyleSheet.create({

})

{/* <Pressable
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
</Pressable> */}