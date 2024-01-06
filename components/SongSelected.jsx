import React, { useState, useEffect } from 'react'

import { TouchableOpacity} from 'react-native';

import { ListItem, Theme, XStack } from 'tamagui'

import { useSelector, useDispatch } from 'react-redux';

import { Image } from 'expo-image';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Audio } from 'expo-av'

import { setSong, setIsPlaying } from '../features/songs/songSlice';

import { Mutex } from 'async-mutex';

import { addFav, removeFav } from '../features/favs/favsSlice';

// Importo fonts para tamagui
import { useFonts } from "expo-font";




export function SongSelected({ navigation }){

    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });


    

    const mutex = new Mutex();

    const favSongs = useSelector(state => state.favs.favs);
    const songSelected = useSelector(state => state.songs.songSelected)
    const isPlaying = useSelector(state => state.songs.isPlaying);
    const songPlayed = useSelector(state => state.songs.songPlayed)

    const [localSong, setLocalSong] = useState([]);

    
    // Dispatcher para ejecutar acciones de las stores
    const dispatch = useDispatch();

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
                
                dispatch(setSong(sound))
                localSong.push(sound); 
        })  
    }

    useEffect(() => {
        // Limpiar el sonido cuando el componente se desmonta
        console.log('reproduciendo: ' + songSelected.trackName);           
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

    const nameIcon = isPlaying ? 'pause' : 'play'

    const isFav = favSongs.some(song => song.trackId === songSelected.trackId);

    const nameFav = isFav ? 'heart' : 'heart-outline'

    const pressFav = () => { isFav ? dispatch(removeFav(songSelected)) : dispatch(addFav(songSelected)) }

    return (
        loaded ?
            <Theme name="blue">
                <ListItem
                    style={{flex: 1, position: 'absolute', bottom: 60}}
                    hoverTheme
                    pressTheme
                    onPress={_ => navigation.navigate('SongDetail') }
                    icon={<Image source={{uri: songSelected.artworkUrl60}} style={{ width: 60, height: 60 }} />}
                    iconAfter={
                        <XStack space="$4">
                            <TouchableOpacity onPress={pressFav}>
                                <Icon name={nameFav} size={45} color="rgb(10, 132, 255)" />
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={playPauseAudio}>
                                <Icon name={nameIcon}  size={45} color="gray" />
                            </TouchableOpacity>
                        </XStack>
                    }
                    title={songSelected.trackName}
                    subTitle={songSelected.artistName}
                />
            </Theme>
         : null
    )

}

export default SongSelected;