import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setTerm } from '../features/songs/songSlice';


import { useFonts } from "expo-font";
import { Theme, Input, YStack, Text, ScrollView, ListItem, XStack, Button } from 'tamagui'



import Icon from 'react-native-vector-icons/FontAwesome';



//import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'

export function Discover({ navigation }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const favs = useSelector(state => state.favs.favs);
  const theme = useSelector(state => state.theme.actual);
  
  const dispatch = useDispatch();

  

  const termSearch = useSelector(state => state.songs.termSearch);

  // Cargo el icono de la app
  const iconItunes  = require("../assets/icon.png")

  // Cargo los fonts para tamagui
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => { dispatch(setTerm('')) }, []);

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

  const buscarArtista = () => {
    console.log(termSearch);
    navigation.navigate('Search');
  }


  return (
      loaded ?
      <SafeAreaView style={styles.main}>
        <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.scroll} contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
          <YStack style={styles.welcome} alignItems="center" space="$4">
              <Image style={styles.image} source={iconItunes} />
              <Text style={styles.text} size="$2">Buscador de canciones en Itunes</Text>
              <View style={styles.container}>
                
                <Theme name={'blue'}>                
                    <Input
                            style={styles.input}
                            size="$5" 
                            borderWidth={1} 
                            placeholder="Ingrese el nombre del artista" 
                            value={termSearch}
                            onChangeText={(text) => dispatch(setTerm(text))}
                            onSubmitEditing={buscarArtista}
                    />
                </Theme>
                { termSearch ? (
                    <TouchableOpacity style={styles.clearButton} onPress={() => dispatch(setTerm(''))} >
                      <Icon name="close" size={40} color="gray" />
                    </TouchableOpacity>
                  ) : null
                }
              </View>

          </YStack>
        </ScrollView>
      </SafeAreaView>
      : null
    
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row'
  },
  scroll: {
    flex: 1,
    height: "100%"
  },
  welcome:{
    flex: 1,
    top: 30
  },
  image: {
    resizeMode: "contain",
    width: "30%",
    height: "30%",
  },
  text: { 
    fontSize: 40,
    top: 0,
    left: 0,
    width: "95%",
    textAlign: 'center',
  },
  input: {
    flex: 1,
    flexGrow: 1,
    width: "100%"
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

  },
  clearButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    padding: 5,
  },
});

export default Discover;