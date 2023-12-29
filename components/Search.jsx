import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ListItem, Theme, Button, Text, YGroup, Separator, Spinner, YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { resetSongs, addSongs } from '../features/songs/songSlice';

import { SongItem } from './SongItem'
import { FlashList } from "@shopify/flash-list";
import { Image } from 'expo-image';

import { useHeaderHeight } from '@react-navigation/elements';


export function Search({ navigation }) {
    

    // States
    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [noMore, setNoMore] = useState(false);
    const [result, setResult] = useState([]);
    const [height, setHeight] = useState(0);
    
    // Stores
    const theme = useSelector(state => state.theme.actual);
    const songs = useSelector(state => state.songs.songs);
    const dispatch = useDispatch();

    const route = useRoute();

    // Altura del header de react-navigation
    const headerHeight = useHeaderHeight();

    // Param a buscars
    const { originalTermSearch } = route.params
    
    // La API de itunes necesita que los espacios se reemplazen por '+'
    // https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    const termSearch = originalTermSearch.replace(/ /g, '+');


    const url = `https://itunes.apple.com/search?term=${termSearch}&country=AR&media=music&entity=song&attribute=artistTerm&limit=50&offset=${offset}`

    useEffect(() => {
        // Actualizar el título dinámicamente usando setOptions
        navigation.setOptions({
            title: `Resultados: '${originalTermSearch}'`,
        });
        buscarArtista();
    }, [originalTermSearch]);

      // https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end
      const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      };

      const fetchMore = () => {
            if(!empty && !error){
                setOffset(prevOffset => prevOffset + 50)
                buscarArtista()
            }
      }

    const buscarArtista = () => {
        if (loading) return; // if it's already loading an image, don't try to pull another
        if (!isSave) {
            setLoading(true);
            dispatch(resetSongs())
        }
        else {
            setMoreLoading(true);
        }

        setError(false)
        fetch(url)
            .then(response => response.json())
            .then(data => { 

                    if(data.resultCount == 0){
                        if(offset == 0)
                            setEmpty(true)
                        else
                            setNoMore(true)
                    }
                    else{
                        if(!error)
                            dispatch(addSongs(data.results))
                        setIsSave(true)

                    }
            })
            .then(_ => setLoading(false))
            .then(_ => setMoreLoading(false))
            .catch(error => {
                setError(true)
                setLoading(false)
                setMoreLoading(false)
            })
            
        ;
    };

    const items = ({item}) => 
        <ListItem
          hoverTheme
          pressTheme
          icon={<Image source={{uri: item.artworkUrl60}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={item.artistName}
        />



    const renderEmpty = () => (
        <View style={{height: height - headerHeight, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.alertText} >No se encontraron resultados</Text>
        </View>    
    )

    const renderFooter = () => (
        <View style={styles.footerText}>
            {moreLoading && <Spinner style={styles.centerText} size="large" />}
            {noMore && <Text>No se encontraron mas resultados</Text>}
            
        </View>
    )


    return ( 
        <SafeAreaView style={styles.main} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
            {   loading ?
                <Spinner style={styles.centerText} size="large" />        
                : 

                <View style={{flex:1}} >
                <Theme name={theme}>
                {error ?
                <View style={styles.centerText}>
                    <Text style={styles.alertText} >Hubo un error en la conexion </Text>
                    <Button onPress={buscarArtista}><Text>Intentar de nuevo</Text></Button>
                </View> :<FlashList
                        data={songs}
                        renderItem={items}
                        estimatedItemSize={25}
                        ListEmptyComponent={renderEmpty}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.4}
                        onEndReached={fetchMore}
                    />
                
                }
                    
                </Theme>
                </View>
            }

        </SafeAreaView>
    )
}

export default Search;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertText: {
        width: '85%',
        fontSize: 20,
        textAlign: 'center',
    },
    footerText: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
});