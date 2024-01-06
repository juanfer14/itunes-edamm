import React, { useState } from 'react'
import { View, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


import { FlashList } from "@shopify/flash-list";

import { ListItem, Theme, Text } from 'tamagui'


// Importo Image de expo para un mejor rendimiento
import { Image } from 'expo-image';

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';

import { setIsSongSelected } from '../features/songs/songSlice'
import { resetFavs, removeFav } from '../features/favs/favsSlice';

//import { SongSelected }  from './SongSelected';
import { setSelectedSong } from '../features/songs/songSlice';
import SongSelected from './SongSelected';

const DEVICE_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = Math.floor(DEVICE_WIDTH / 4);
const IMAGE_WIDTH = COLUMN_WIDTH - 2;

export function Favs() {
    // Permite ajustar la altura, cuando no se obtienen resultados o hay error 
    const [height, setHeight] = useState(Dimensions.get('window').height);
    

    // Stores
    const favs = useSelector(state => state.favs.favs);
    const theme = useSelector(state => state.theme.actual);
    const component = useSelector(state => state.songs.component)
    const isSongSelected = useSelector(state => state.songs.isSongSelected)

    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

    const selectSong = (song) => {
        dispatch(setSelectedSong(song))
        dispatch(setIsSongSelected(true));
        console.log(isSongSelected)
    }



    const items = ({item}) => 
        <ListItem
          pressTheme
          icon={<Image source={{uri: item.artworkUrl60}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={item.artistName}
          onPress={_ => selectSong(item)}
        />

    const renderEmpty = () => (
        <View style={{height: height, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.alertText}>No se agregaron canciones favoritas</Text>
        </View>    
    )

    return (
        <SafeAreaView style={styles.main} onLayout={(event) => setHeight(event.nativeEvent.layout.height)} >
            <Theme name={theme}>  
                <View style={styles.main}>
                    <FlashList
                        contentContainerStyle={{paddingBottom: 70}}
                        data={favs}
                        renderItem={items}
                        estimatedItemSize={25}
                        ListEmptyComponent={renderEmpty}
                        onEndReachedThreshold={0.4}
                    />
                </View>
            </Theme>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column'
    },
    scroll: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column'
    },
    alertText: {
        width: '85%',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Favs;
