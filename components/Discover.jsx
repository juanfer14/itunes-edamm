import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addFav, removeFav } from '../features/favs/favsSlice';
import { ListItemDemo } from './SongItem'

/* Instancio el stack de navegacion, para que solamente se
 * agregue una nueva ventana, cuando el usuario seleccione
 * una de las posibles canciones del artista
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigatoNavigator } from '@react-navigation/native-stack';

import { useFonts } from "expo-font";
import { Input, YStack, Paragraph } from 'tamagui'


//const Stack = createNativeStackNavigator();

export function Discover({ navigation }) {

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const favs = useSelector(state => state.favs.favs);
  const dispatch = useDispatch();

  useEffect(() => { loadRandomImage(); }, []);

  const loadRandomImage = () => {
    if (loading) return; // if it's already loading an image, don't try to pull another

    // get screen size
    const width = Math.floor(Dimensions.get('window').width);
    const height = Math.floor(Dimensions.get('window').height);

    // fetch a random image
    setLoading(true);
    // fetch returns a Promise, .then handles ok response, .catch handles error. This call is non-blocking
    fetch(`https://picsum.photos/${width}/${height}`)
      .then(response => setImageUrl(response.url))
      .catch(error => console.error(`Oh no! Something went wrong: ${error}`))
      .then(_ => setLoading(false))
    ;
  };

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  return (
      loaded ?
      <SafeAreaView style={styles.main}>
        <YStack style={styles.welcome} alignItems="center" space="$2">
          <Paragraph style={styles.text} size="$6">Buscador de canciones en Itunes</Paragraph>
          <Input style={styles.input} size="$4" borderWidth={2} placeholder="Ingrese el nombre del artista..." />
        </YStack>
        {/*}
        <View style={styles.imageHolder}>
          {imageUrl && <Image style={styles.image} source={{uri: imageUrl}} />}
          <TouchableOpacity onPress={_ => { favs.includes(imageUrl) ? dispatch(removeFav(imageUrl)) : dispatch(addFav(imageUrl)) }} style={styles.fav}>
              <FontAwesome
                  name={favs.includes(imageUrl) ? 'heart' : 'heart-o'}
                  size={30}
                  color='#F00'
              />
          </TouchableOpacity>
        </View>
        {*/}

        {/*}
        <View style={styles.footer}>
          <Button title="Descubrir nueva" onPress={loadRandomImage} />
          <Button title="Mis favoritas" onPress={() => navigation.navigate('Favs')} />
        </View>


        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {*/}


      </SafeAreaView>
      : null
    
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  welcome:{
    top: 80,
    flex: 1,
  },
  text: {
    
    bottom: 20,
  },
  input: {
    width: '90%'
  },
  imageHolder: {
    flex: 1,

  },
  fav: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },
  image: {
    flex: 1,
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
});

export default Discover;