import React, { useEffect, useState } from 'react'
import { View, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlashList } from "@shopify/flash-list";

import { ListItem, Theme, Text, XStack } from 'tamagui'

// Importo Image de expo para un mejor rendimiento
import { Image } from 'expo-image';

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';

import { setIsSongSelected } from '../features/songs/songSlice'

//import { SongSelected }  from './SongSelected';
import { setSelectedSong } from '../features/songs/songSlice';

import { MaterialIcons } from '@expo/vector-icons';


export function Favs() {
    // Permite ajustar la altura, cuando no se obtienen resultados o hay error 
    const [height, setHeight] = useState(Dimensions.get('window').height);
    const [padBot, setPadBot] = useState();
    

    // Stores
    const favs = useSelector(state => state.favs.favs);
    const theme = useSelector(state => state.theme.actual);
    const isSongSelected = useSelector(state => state.songs.isSongSelected)

    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

    const selectSong = (song) => {
        dispatch(setSelectedSong(song))
        dispatch(setIsSongSelected(true));
    }

    useEffect(() => {
        isSongSelected ? setPadBot(70) : setPadBot(0);
    }, [isSongSelected])

    const explicit = <MaterialIcons name="explicit"  size={20} color={'orange'} />

    const isExplicit = (song) => 
        <XStack flex={1} flexDirection='row' alignItems="center">
        {song.trackExplicitness.includes('explicit') ? explicit : null}
        {<Text numberOfLines={1}>{song.artistName}</Text>}
        </XStack>

    const items = ({item}) => 
        <ListItem
          pressTheme
          icon={<Image source={{uri: item.artworkUrl60.replace("60x60", "120x120")}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={isExplicit(item)}
          onPress={() => selectSong(item)}
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
                        contentContainerStyle={{paddingBottom: padBot}}
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
        flexDirection: 'column',
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
