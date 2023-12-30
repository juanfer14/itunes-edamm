import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ListItem, Theme, Button, Text, YGroup, Separator, Spinner, YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { resetSongs, addSongs } from '../features/songs/songSlice';

import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { SongItem } from './SongItem'
import { FlashList } from "@shopify/flash-list";
import { Image } from 'expo-image';

import { useHeaderHeight, ThemeProvider } from '@react-navigation/elements';


export function Search({ navigation }) {
    // States
    const [loading, setLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [error, setError] = useState(false);
    const [noMore, setNoMore] = useState(false);
    const [offset, setOffset] = useState(0);

    // Permite ajustar la altura, cuando no se obtienen resultados o hay error 
    const [height, setHeight] = useState(0);

    // Altura del header de react-navigation
    const headerHeight = useHeaderHeight();
    
    // Stores
    const theme = useSelector(state => state.theme.actual);
    const songs = useSelector(state => state.songs.songs);

    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

    const route = useRoute();

    // Param a buscars
    const {originalTermSearch} = route.params
    const [term, setNewTerm] = useState(originalTermSearch)
    const [termSearch, setTermSearch] = useState('')
    
    // La API de itunes necesita que los espacios se reemplazen por '+'
    // https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    // URL donde se debe realizar la consulta
    const url = `https://itunes.apple.com/search?term=${termSearch}&country=AR&media=music&entity=song&attribute=artistTerm&limit=50&offset=${offset}`

    useEffect( () => {
        setNoMore(false);
        setOffset(0);
        if(term){
            console.log(term)
            
            console.log(termSearch)
            if(!error)
                dispatch(resetSongs());
            buscarArtista();
        }
    }, [term]);

      
    const fetchMore = () => {
        if(!moreLoading && !noMore && !error){
            setOffset(prevOffset => prevOffset + 50)
            buscarArtista()
        }
      }

    const cargarDatos = (data) => {
        console.log(url)
        // Si proviene de un error, no se carganda datos
        if(error) {
            setError(false); 
            return;
        }
        // Verificar la cantidad de resultados que se retornan
        if(data.resultCount == 0 && offset > 0)
            setNoMore(true)
        else if(data.resultCount > 0)
            dispatch(addSongs(data.results))
    }

    const buscarArtista = () => {
        if(loading || moreLoading) return;
        if(songs)
            setMoreLoading(true);
        else
            setLoading(true);
        console.log('fetcheando')
        fetch(url)
            .then(response => response.json())
            .then(cargarDatos)
            .catch(error => setError(true))
            .then(_ => setLoading(false))
            .then(_ => setMoreLoading(false))      
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
            <Text style={styles.alertText}>No se encontraron resultados</Text>
        </View>    
    )


    const renderFooter = () => (
        <View style={styles.footerText}>
            {moreLoading && <Spinner style={styles.centerText} size="large" />}
            {noMore && <Text>No se encontraron mas resultados</Text>} 
        </View>
    )

    const cambiarText = useCallback((text) => {
        setNewTerm(text);
        setTermSearch(text.replace(/ /g, '+'));
    }, [])

    return ( 
        <SafeAreaView style={styles.main} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
            <Theme name={theme}>
                <View style={styles.main}>
                    <Input
                        style={{fontSize: 25, color: theme === 'dark' ? 'white' : 'black'}}
                        containerStyle={{height: 30, bottom: 25}}
                        value={term}
                        onChangeText={cambiarText}
                        rightIcon={
                            term ? 
                            <TouchableOpacity onPress={() => setNewTerm('')} >
                                <Icon name="close-circle-outline" size={40} color="gray" />
                            </TouchableOpacity> : null}
                    />
                    { loading ?
                        <Spinner style={styles.centerText} size="large" />        
                    : 
                        <View style={styles.main} >
                        { error ?
                            <View style={styles.centerText}>
                                <Text style={styles.alertText} >Hubo un error en la conexion </Text>
                                <Button onPress={buscarArtista}><Text>Intentar de nuevo</Text></Button>
                            </View> 
                            :
                            <FlashList
                                data={songs}
                                renderItem={items}
                                estimatedItemSize={25}
                                ListEmptyComponent={renderEmpty}
                                ListFooterComponent={this.renderFooter}
                                onEndReachedThreshold={0.4}
                                onEndReached={fetchMore}
                            />
                        }
                        </View>
            }
            </View>
            </Theme>
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