import { StyleSheet, FlatList, View, Dimensions, Animated } from "react-native";
import CarouselItem from "./CarouselItem";
import Pagination from "./Pagination";
import { useRef, useState } from "react";

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width

export default function TopTenCarousel ({listings}) {
    const [index, setIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    function handleOnScroll (event) {
        Animated.event([
            {
                nativeEvent: {
                    contentOffset: {
                        x: scrollX,
                    }
                }
            }
        ], {
            useNativeDriver: false,
        })(event)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                renderItem={({item}) => <CarouselItem item={item}/>}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
                
            />
            <Pagination listings={listings} scrollX={scrollX}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: screenHeight * 0.4,
        width: screenWidth,
    }
})
