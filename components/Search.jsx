import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';

import { Button, Text, YGroup, Separator, Spinner, YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { SongItem } from './SongItem'


export function Search({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [result, setResult] = useState([]);
    


    const route = useRoute();
    const { originalTermSearch } = route.params
    
    // La API de itunes necesita que los espacios se reemplazen por '+'
    // https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    const termSearch = originalTermSearch.replace(/ /g, '+');

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

      const detectBottom = ({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
           buscarArtista();
          }
      }

    const buscarArtista = () => {
        if (loading) return; // if it's already loading an image, don't try to pull another
        setLoading(true);
        setError(false)
        const url = `https://itunes.apple.com/search?term=${termSearch}&country=AR&media=music&entity=song&attribute=artistTerm&limit=30&offset=${offset}`
        fetch(url)
            .then(response => response.json())
            .then(data => { 
                    if(data.resultCount == 0)
                        setEmpty(true)
                    else{
                        setResult(prevData => [...prevData, ...data.results])
                        setOffset(prevOffset => prevOffset + 30)                    
                        setIsSave(true)
                    }
            })
            .then(_ => setLoading(false))
            .catch(error => setError(true))
            
        ;
    };

    return ( 
        <SafeAreaView style={styles.main}>
            <ScrollView onScroll={detectBottom} style={styles.scroll} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
                
                <View style={{flex: 1}}>
                        {isSave && <SongItem songs={result} />}
                        {error && <Text style={loading}>Hubo un error en la conexion</Text>}
                        <View style={styles.centerText}>
                            {empty && <Text >No se encontraron resultados resultados</Text>}
                        </View>
                </View>            
                
                {loading && (
                        <Spinner style={isSave ? styles.loaded : styles.loading} size="large" />    
                )} 
                
        </ScrollView>
        </SafeAreaView>
    )
}

export default Search;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    scroll: {
        flex: 1,
        height: "100%"
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
    loaded: {
        top: 15,
        bottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});