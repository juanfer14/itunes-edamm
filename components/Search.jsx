import React, { useEffect, useState } from 'react'
import { View, StyleSheet,  TouchableOpacity} from 'react-native';

// Importo SafeAreaView para considerar los margenes del status-bar
import { SafeAreaView } from 'react-native-safe-area-context';

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';
import { setSong, setIsSongSelected } from '../features/songs/songSlice';
import { setMoreLoading, setNoMore, setOffset, setError, setLoad } from '../features/status/statusSlice'

import { SongItem } from './SongItem'
import { InputFetch } from './InputFetch'
import { Retry } from './Retry'


// Importo axios para fetching
import axios from 'axios'

// Importo componente de librerias
import { Spinner } from 'tamagui'

// Importo mutex para sincronismo
import {Mutex, Semaphore, withTimeout} from 'async-mutex';




export function Search({ navigation }) {
    // States
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState([]);

    // Stores
    const error = useSelector(state => state.status.error);
    const offset = useSelector(state => state.status.offset);
    const moreLoading = useSelector(state => state.status.moreLoading);
    const load = useSelector(state => state.status.load)
    // Termino a buscar
    const term = useSelector(state => state.songs.termSearch)

    // La API de itunes necesita que los espacios se reemplazen por '+'
    // https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    // URL donde se debe realizar la consulta
    const url = `https://itunes.apple.com/search?term=${term.replace(/ /g, '+')}&country=AR&media=music&entity=song&attribute=artistTerm&limit=50&offset=${offset}`
    
    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

    
    
    const mutex = new Mutex();

    useEffect( () => {
        dispatch(setSong(null));
        dispatch(setIsSongSelected(false));
        buscarArtista();
    }, [term]);

    useEffect(() => {
        dispatch(setLoad(false))
        buscarArtista();
    }, [load])

      
    
    const cargarDatos = (data) => {
        // Si proviene de un error y ya cargo datos, no cargo mas datos
        if(error & offset > 0) {
            dispatch(setError(false));     
            return;
        }
        // Si proviene de un error y no cargo datos, entonces si carga
        dispatch(setError(false));

        // Verificar la cantidad de resultados que se retornan
        if(data.resultCount == 0 && offset > 0){
            dispatch(setNoMore(true))
        }
        else if(data.resultCount > 0){
            dispatch(setOffset(offset + 50))
            setSongs(songs => [...songs, ...data.results]) 
        }       
    }

    const buscarArtista = async() => {
        if(term && term.length > 1){
            await mutex.runExclusive(async () => {
                if(loading || moreLoading) return;
                
                dispatch(setNoMore(false));
            
                if(offset > 0){
                    dispatch(setMoreLoading(true))
                }
                else{
                    setLoading(true);
                    console.log('reiniciando canciones')
                    songs.length = 0;
                }
                
                console.log(`el offset es de ${offset}`)
                

                await axios.get(url)
                    .then(res => {
                        console.log(url)
                        console.log(term)
                        cargarDatos(res.data)
                        
                    })
                    .catch(error => {
                        dispatch(setError(true));
                    })

                setLoading(false)
                dispatch(setMoreLoading(false))
            })
        }
        
        
    };

    return ( 
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <InputFetch/>
                { 
                    loading ?
                        <Spinner style={styles.centerText} size="large" />        
                    : 
                        <View style={styles.main} >
                            <Retry/>
                            <SongItem songs={songs}/>
                        </View>
                }
            </View>
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