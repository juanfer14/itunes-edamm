import { View, Image, ScrollView, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';

const DEVICE_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = Math.floor(DEVICE_WIDTH / 4);
const IMAGE_WIDTH = COLUMN_WIDTH - 2;

export function Favs() {
    const favs = useSelector(state => state.favs.favs);

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView contentContainerStyle={styles.imgGalleryContainer}>
                {favs.map((imageUrl, index) => (
                    <View key={index} style={styles.itemGallery}>
                        <Image
                            source={{uri: imageUrl}}
                            style={styles.imgGallery}
                            resizeMode="stretch"
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    imgGalleryContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },
    itemGallery: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        alignContent: 'center',
    },
    imgGallery: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderWidth: 1,
        borderColor: '#fff',
        margin: 'auto',
    },
});

export default Favs;
