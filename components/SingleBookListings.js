import { Text, StyleSheet, Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function SingleBookListings () {
    const navigation = useNavigation();

    return (
        <View>
            <Text>This is the single book listings page</Text>
            <Pressable onPress={() => {navigation.navigate('ListedBook')}} style={styles.button}>
                <Text>Button!</Text>
            </Pressable>
            <Text>This is going to be a list of cards, each card will be a link to an individual book page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        borderColor: 'blue'
    }
})