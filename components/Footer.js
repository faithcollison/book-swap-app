import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Footer () {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            <View style={styles.footerContent}>
                <Feather name="home" size={30} style={styles.icon} onPress={() => navigation.navigate('Home')}/>
                <Feather name="message-circle" size={30} onPress={() => navigation.navigate('Messages')}/>
                <Feather name="plus-circle" size={45} onPress={() => navigation.navigate('CreateListing')}/>
                <Feather name="bell" size={30} onPress={() => navigation.navigate('Notifications')}/>
                <Feather name="user" size={30} onPress={() => navigation.navigate('UserProfile')}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        height: screenHeight * 0.09,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: 0,
        width: screenWidth,
        borderTopWidth: 2,
        borderRadius: 20,
    },
    footerContent: {
        width: screenWidth * 0.8,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    }
})