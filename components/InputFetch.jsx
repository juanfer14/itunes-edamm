// Importo componentes de react native
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity} from 'react-native';

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';
import { setLoad, setOffset } from '../features/status/statusSlice'
import { setTerm, setIsSongSelected, setSong } from '../features/songs/songSlice';

// Importo iconos
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importo Input de react-native
import { SearchBar } from '@rneui/themed';
import { XStack } from 'tamagui';

import { CommonActions } from '@react-navigation/native';

// Importo mutex para sincronismo
import {Mutex, Semaphore, withTimeout} from 'async-mutex';

const mutex = new Mutex();

export  function InputFetch({navigation}){
    const [background, setBackground] = useState('white');
    const [border, setBorder] = useState('white');
    const [letterColor, setLetterColor] = useState('white');
    const [isWhite, setIsWhite] = useState(false);

    const dispatch = useDispatch();

    // Termino a buscar
    const term = useSelector(state => state.songs.termSearch)
    const isDark = useSelector(state => state.theme.isDark);
    const load = useSelector(state => state.status.load)

    const inputRef = useRef(null);

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
        }
    }, [])

    useEffect(() => {
        const nameBackBorder = isDark ? 'rgb(23, 32, 42)' : 'white';
        const nameLetter =  isDark ? 'white' : 'black';

        setBackground(nameBackBorder);
        setBorder(nameBackBorder);
        setLetterColor(nameLetter);
        setIsWhite(!isDark);
    }, [isDark])

    const cambiarText = async (text) => {
        await mutex.runExclusive( async() => {
            dispatch(setOffset(0))
            dispatch(setTerm(text));
        })
    }

    const enviar = async () => {
        await mutex.runExclusive( async() => {
            dispatch(setOffset(0))
            dispatch(setLoad(!load))
            inputRef.current.blur()
        })
    }


    return (
        <SearchBar
            containerStyle={{ flexDirection: 'row', alignItems: 'center', backgroundColor: background, borderColor: border }}
            inputStyle={{color: letterColor}}
            inputContainerStyle={{backgroundColor: background}}
            ref={inputRef}
            placeholder='Ingrese el nombre del artista...'
            lightTheme={isWhite}
            style={{flex:1, fontSize: 16}}
            value={term}
            onChangeText={cambiarText}
            searchIcon={
                <TouchableOpacity onPress={_ => navigation.dispatch(CommonActions.goBack())}>
                    <Icon name="keyboard-backspace" size={40} color="gray" />
                </TouchableOpacity>
            }
            clearIcon={
                term ?
                <XStack space="$2">
                    <TouchableOpacity onPress={() => cambiarText('')} >
                        <Icon name="close-box" size={36} top={2} color="gray" />
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={enviar} >
                        <Icon name="card-search" size={40}  color="gray" />
                    </TouchableOpacity>
                </XStack>
                : null
                
            }
            round={false}

            
        />
    )
}

export default InputFetch;