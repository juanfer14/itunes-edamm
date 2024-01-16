import React, { useState, useEffect, useRef } from 'react'

import { TouchableOpacity, Dimensions, StyleSheet, View} from 'react-native';

import { ListItem, Theme, XStack, Text } from 'tamagui'

import { useSelector, useDispatch } from 'react-redux';

import { Image } from 'expo-image';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Audio } from 'expo-av'

import { setSong, setIsPlaying, setSelectedSong, setIsSongSelected } from '../features/songs/songSlice';

import { Mutex } from 'async-mutex';

import { addFav, removeFav } from '../features/favs/favsSlice';

// Importo fonts para tamagui
import { useFonts } from "expo-font";

import Toast from 'react-native-root-toast'


import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";


import TextTicker from 'react-native-text-ticker'

export function SongSelected({ navigation }){

    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });
    

    const mutex = new Mutex();

    const [localSong, setLocalSong] = useState([]);
    const [toast, setToast] = useState(null);
    const [nameFav, setNameFav] = useState('heart');
    const [namePlaying, setNamePlaying] = useState('pause');

    const favSongs = useSelector(state => state.favs.favs);
    const songSelected = useSelector(state => state.songs.songSelected)
    const isPlaying = useSelector(state => state.songs.isPlaying);
    const songPlayed = useSelector(state => state.songs.songPlayed)

    const isFav = favSongs.some(song => song.trackId === songSelected?.trackId);

    

    const options = {
        duration: 3500,
        position: -150,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: 'rgb(10, 132, 255)',
        textColor: 'white',
    }
    
    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

    useEffect(() => {
        isFav ? setNameFav('heart') : setNameFav('heart-outline');
    }, [isFav])

    useEffect(() => {
        isPlaying ? setNamePlaying('pause') : setNamePlaying('play');
    }, [isPlaying])

    const loadAudio = async () => {
        await mutex.runExclusive(async () => {
                dispatch(setIsPlaying(false))

                    
                const { sound } = await Audio.Sound.createAsync(
                    { uri: songSelected.previewUrl },
                    { shouldPlay: false },
                    (status) => {
                        if(status.didJustFinish){
                            console.log("se esta pausando")
                            dispatch(setIsPlaying(false));
                            sound.pauseAsync();
                            sound.setPositionAsync(0);
                        }
                        
                        
                    }
                );
                await sound.setVolumeAsync(1)
                dispatch(setSong(sound))
                localSong.push(sound); 
        })  
    }

    useEffect(() => {
        // Limpiar el sonido cuando el componente se desmonta
        console.log('reproduciendo: ' + songSelected?.trackName);           
        dragX.value = 0;
        loadAudio();
        return async () => {
            await mutex.runExclusive(async () => {
                localSong.forEach((elem) => {elem.unloadAsync()})
                setLocalSong([]);
            })
        }
      }, [songSelected]);


      useEffect(() => {
        playPauseAudio();
      }, [songPlayed])



    const playPauseAudio = async () => {
        await mutex.runExclusive(async () => {
            try {
                const status = await songPlayed.getStatusAsync();
                if (songPlayed && status.isLoaded) {
                    if (status.isPlaying) {
                        await songPlayed.pauseAsync();
                    } else {
                        await songPlayed.playAsync();
                    }
                    dispatch(setIsPlaying(!isPlaying));
                }
            }
            catch(error){console.log(error)}
        }) 
    };

    

    const pressFav = () => { 
        if(toast){
            Toast.hide(toast);
            setToast(null);
        }

        const eliminar = 'Eliminado de favoritos';
        const agregar = 'Agregado a favoritos!';
        
        if(isFav){
            setToast(Toast.show(eliminar, options));
            dispatch(removeFav(songSelected));
        }
        else {
            setToast(Toast.show(agregar, options));
            dispatch(addFav(songSelected));
        }
        setTimeout(() => {
            if(toast) {
                Toast.hide(toast)
                setToast(null);
            }
        }, 3500)
    }


    const stopSong = async () => {
        dispatch(setIsSongSelected(false));
    }
    
    const DEVICE_WIDTH = Dimensions.get('window').width;
    const threshold1 = DEVICE_WIDTH * 0.4;
    const threshold2 = -DEVICE_WIDTH * 0.4;
    const dragX = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (e) => {
            dragX.value = e.translationX;
        },
        onEnd: (e) => {
            if(e.translationX > threshold1 || e.translationX < threshold2){
                dragX.value = withTiming(DEVICE_WIDTH);
                runOnJS(stopSong)();

            } else {
                dragX.value = withTiming(0);
            }
        }
        
    })

    const itemContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: dragX.value
                }
            ],
        }
    })
    

    return (
        loaded ?
            // https://www.youtube.com/watch?v=eQAXkuyjpwY
            <PanGestureHandler onGestureEvent={gestureHandler} >
            
                <Animated.View style={ [styles.container, itemContainerStyle]}>
                <Theme name="blue">
                <ListItem

                    hoverTheme
                    pressTheme
                    onPress={() => navigation.navigate("SongDetail") }
                    icon={<Image source={{uri: songSelected?.artworkUrl60.replace("60x60", "600x600")}} style={{ width: 60, height: 60 }} />}
                    iconAfter={
                        <XStack space="$4">
                            <TouchableOpacity onPress={pressFav}>
                                <Icon name={nameFav} size={45} color="rgb(10, 132, 255)" />
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={playPauseAudio}>
                                <Icon name={namePlaying}  size={45} color="gray" />
                            </TouchableOpacity>
                        </XStack>
                    }
                    subTitle={songSelected?.artistName}
                    
                    
                />
                <View style={{position: 'absolute', bottom: 45, left: 92, width: "40%"}}>
                    <TextTicker
                        duration={300*songSelected?.trackName.length}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}
                    >
                        <Text>{songSelected.trackName}</Text>
                    </TextTicker>
                </View>
                </Theme>
                </Animated.View>

            
            </PanGestureHandler>
            
            
            
         : null
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom: 60, 
        position: 'absolute',
        width: "100%",
        
    }
})

export default SongSelected;