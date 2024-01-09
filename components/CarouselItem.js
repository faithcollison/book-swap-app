import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
// import { getColors } from 'react-native-image-colors'

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function CarouselItem ({item}) {
    // const useImageColors = () => {
    //     const [colors, setColors] = React.useState(null)

    //     React.useEffect(() => {
    //         const url = item.img_url;

    //         getColors(url, {
    //         fallback: '#228B22',
    //         cache: true,
    //         key: url,
    //         }).then(setColors)
    //     }, [])

    //     return colors
    // }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.imgContainer}>
                    <Image style={styles.image} source={{uri: item.img_url}}/>
                </View>
                <Text style={styles.title} >{item.book_title}</Text>
                <Text style={styles.author}>{item.author}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 250,
        maxWidth: 165,
        resizeMode: 'cover',
        borderRadius: 20,
    },
    imgContainer: {
        height: 250,
        width: 165,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        height: screenHeight * 0.4 * 0.9,
        width: screenWidth,
    },
    card: {
        // backgroundColor: '#FFA351FF',
        // backgroundColor: '#77AB5F',
        backgroundColor: '#EBEBEB',
        borderRadius: 20,
        width: screenWidth * 0.8,
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 16,
    },
    title: {
        textAlign: 'center',
    },
    author: {
        textAlign: 'center',
    }
})