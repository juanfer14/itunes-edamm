import React, { useState } from 'react';
import { View, StyleSheet, Share, Alert, ScrollView } from 'react-native'
// Importo fonts para tamagui
import { useFonts } from "expo-font";
import { Button, ListItem, Text, Theme, Separator, Card, H5, YStack, XStack, Image, Tabs } from 'tamagui'

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

//import { Image } from 'expo-image';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';



import { FlashList } from "@shopify/flash-list";


import * as WebBrowser from 'expo-web-browser';

import moment from 'moment';
import 'moment/locale/es'  
import { useEffect } from 'react';


export function SongDetail(){
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    const [margBot, setMargBot] = useState(0);
    const [actualTheme, setActualTheme] = useState('white');
    const [songSelected, setSongSelected] = useState(null);


    const isSongSelected = useSelector(state => state.songs.isSongSelected)

    // El tema que actualmente esta siendo utilizado de la store
    const isDark = useSelector(state => state.theme.isDark);
    const songSel = useSelector(state => state.songs.songSelected);

    

    // Iconos
    const Disco = <MaterialIcons name="album" size={24} color={actualTheme} />
    const Artista = <Icon name="person" size={24} color={actualTheme}/>
    const Timer = <MaterialCommunityIcons name="timer" size={24} color={actualTheme} />
    const Genero = <Fontisto name="applemusic" size={24} color={actualTheme} />
    const Date = <Icon name="calendar-sharp" size={24} color={actualTheme} />
    const Precio = <Icon name="card-outline" size={24} color={actualTheme} />
    

    const nombreArtista = songSelected?.artistName;
    const artistas = nombreArtista?.split(/[.\&,_]/);

    const ms = songSelected?.trackTimeMillis;
    const minutos = Math.floor((ms/1000/60) << 0);
    const segundos = Math.floor((ms/1000) % 60)

    const fecha = moment(songSelected?.releaseDate).format("DD/MM/YYYY");

    const moneda = songSelected?.currency;
    const precioCancion = songSelected?.trackPrice;
    const precioAlbum = songSelected?.collectionPrice;

    useEffect(() => {
        setSongSelected(songSel);
    }, [])

    useEffect(() => {
        isDark ? setActualTheme("white") : setActualTheme("black");
    }, [isDark])

    useEffect(() => {
        if(isSongSelected){
            setMargBot(140)
            setSongSelected(songSel);
        }
        else {
            setMargBot(60);
        }
    }, [isSongSelected])


    const share = async () => {
        try {
            await Share.share({
                title: 'Buscador de Itunes - EDAMM\n',
                message: `Tema compartido desde buscador de itunes EDAMM: ${songSelected?.trackViewUrl}`,
                url: `${songSelected?.trackViewUrl}`
            }); 
          } catch (error) {
            Alert.alert(error.message);
          }
          
    }

    const items = ({item}) => 
        item ?
        <ListItem
          pressTheme
          title={item.trim()}
        />
        : null

    return (
        loaded ? 
            <View style={styles.main}>
                
                <Separator borderWith={2}/>
                
                <View style={{flex: 1, flexGrow: 1, marginBottom: margBot }}>
                    <ScrollView  indicatorStyle='white' >
                    <View style={styles.center}>
                        <Card 
                            elevate 
                            bordered
                            animation="bouncy"
                            marginBottom={20}
                            width={300}
                            height={300}
                            scale={0.9}
                            hoverStyle={{ scale: 0.925 }}
                            pressStyle={{ scale: 0.875 }}
                            borderRadius={20}
                        >
                            <Card.Background>
                                <Image resizeMode="contain" alignSelf='center' borderRadius={20}  source={{uri: songSelected?.artworkUrl100.replace("100x100", "600x600")}}  style={{ width: 300, height: 300}} />
                            </Card.Background>
                        </Card>
                        
                        <XStack alignSelf='center' justifyContent='center' width={340} flex={1}>
                                    <H5 onPress={() => WebBrowser.openBrowserAsync(songSelected?.trackViewUrl)} fontWeight={800}>{songSelected?.trackName}</H5>
                        </XStack>
                        
                        
                        
                    </View>
                    
                    <View style={{flex:1, flexGrow: 1}}>
                        <ListItem fontSize={20} size={"$4"} icon={Timer} >Duración</ListItem>
                        <ListItem pressTheme><Text>{minutos} min, {segundos} seg</Text></ListItem>
                        <Separator borderWidth={1} />
                        <ListItem fontSize={20} size={"$4"} icon={Genero}>Género</ListItem>
                        <ListItem pressTheme>{songSelected?.primaryGenreName}</ListItem>
                        <Separator borderWidth={1} />
                        <ListItem fontSize={20} size={"$4"} icon={Disco}>Álbum</ListItem>
                        <ListItem pressTheme title={songSelected?.collectionName}/>
                        <Separator borderWidth={1} />
                        <ListItem fontSize={20} size={"$4"} icon={Artista}>Nombre Artista/s</ListItem>
                        <View style={{minHeight: 4}}>
                            <FlashList data={artistas} renderItem={items} estimatedItemSize={50}/>
                        </View>
                        <Separator borderWidth={1} />
                        <ListItem fontSize={20} size={"$4"} icon={Date}>Fecha de Lanzamiento</ListItem>
                        <ListItem pressTheme><Text>{fecha}</Text></ListItem>
                        <Separator borderWith={1} />
                        {
                            precioCancion ?
                            <>
                            <ListItem fontSize={20} size={"$4"} icon={Precio}>Precio</ListItem>
                            <ListItem>
                            <Theme name="blue">
                            <XStack flex={1} flexGrow={1}>
                                
                                <YStack flex={1} alignItems='center'>
                                    <H5>Canción</H5>
                                    <Button><H5>{moneda} {precioCancion}</H5></Button>
                                </YStack>
                                
                                <YStack flex={1} alignItems='center'>
                                    <H5>Álbum</H5>
                                    <Button><H5>{moneda} {precioAlbum}</H5></Button>
                                </YStack>
                                
                            </XStack>
                            </Theme>
                            
                            </ListItem> 
                            </>
                            : null}
                    </View>
                    
                    </ScrollView>    
                    
                    
                </View>
                
                <Theme name="blue">
                    <Button 
                        iconAfter={<Icon name="share-social-sharp" size={30} color={'white'} />}
                        style={styles.button}
                        size="$1"
                        theme="active"
                        themeInverse
                        onPress={share}
                    >
                        <Text style={{color: 'white', fontSize: 19}}>Compartir</Text>
                    </Button>
                </Theme>
                
            </View>
        : null
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexGrow: 1,
    },
    button: {
        height: 60,
        position: 'absolute',
        bottom: 0,
        width: "100%",   
    },
    center: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'top',   
        marginVertical: 30
    }
})

export default SongDetail;