// Importo componentes de react y react-native
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image  } from 'react-native';

// Importo componente para asegurar el status-bar
import { SafeAreaView } from 'react-native-safe-area-context';


// Importo metodos del stores de react-redux
import { useSelector, useDispatch } from 'react-redux';

// Importo metodo para setear a vacio el string de busqueda
import { setTerm } from '../features/songs/songSlice';

// Mutex para el renderizado de componentes
import { useMutex } from 'react-context-mutex';

// Fonts de tamagui
import { useFonts } from "expo-font";

// Componentes de tamagui
import { Theme, YStack, ScrollView, Button, Text } from 'tamagui'

// Icono de busqueda
import Icon from 'react-native-vector-icons/FontAwesome';

import TextTicker from 'react-native-text-ticker'

export function Discover({ navigation }) {
  // Cargo el icono de la app
  const iconItunes  = require("../assets/icon.png")

  // Cargo los fonts para tamagui
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Status del componente
  const [theme, setTheme] = useState('');

  // Dispatch para metodos de la store
  const dispatch = useDispatch();

  const isDark = useSelector(state => state.theme.isDark);
  const termSearch = useSelector(state => state.songs.termSearch);
  

  useEffect(() => { 
    dispatch(setTerm(''));
  }, []);

  useEffect(() => {
    isDark ? setTheme('white') : setTheme('black');
  }, [isDark])


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
                    <Button
                      
                      textAlign='left'
                      variant="outlined"
                      style={styles.button}
                      size="$5"
                      theme="active"
                      icon={<Icon name="search" size={24} color={theme} />}
                      onPress={buscarArtista}
                    >
                      <Text fontSize={18}>
                        Buscar el nombre del artista
                      </Text>
                      
                    </Button>
                </Theme>
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
    width: "40%",
    height: "40%",
  },
  text: { 
    fontSize: 40,
    width: "95%",
    textAlign: 'center',
    justifyContent: 'center',
    
  },
  button: {
    flex: 1,
    flexGrow: 1,
    width: "100%",
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

  }
});

export default Discover;