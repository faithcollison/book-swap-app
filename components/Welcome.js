import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Welcome ({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Welcome!</Text>

            <View style={styles.buttonContainer}>
                <Pressable onPress={() => {
                    navigation.navigate('Login')
                }}>
                    <Text>Log In</Text>
                </Pressable>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={() => {
                    navigation.navigate('SignUp')
                }}>
                    <Text>Sign Up</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        padding: 3,
        alignItems: "center",
        justifyContent: "center",
    },
})