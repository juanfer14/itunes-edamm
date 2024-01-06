// Importo componentes y hook de react
import React, { memo, useState, useEffect } from 'react'
import {  View, StyleSheet} from 'react-native' 


// Importo componente de librerias
import { Text, ListItem,  Spinner } from 'tamagui'

// Importo Image de expo para un mejor rendimiento
import { Image } from 'expo-image';

// Importo fonts para tamagui
import { useFonts } from "expo-font";

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';
import { setLoad, setMoreLoading } from '../features/status/statusSlice';
import { setIsSongSelected, setSelectedSong } from '../features/songs/songSlice'

// Importo flashlist para un mejor rendimiento
import { FlashList } from "@shopify/flash-list";

// Obtengo el header del stack de navegacion
import { useHeaderHeight } from '@react-navigation/elements';


export const SongItem = memo((props) => {

  const {songs} = props;

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const dispatch = useDispatch();

  // Permite ajustar la altura, cuando no se obtienen resultados o hay error 
  const [height, setHeight] = useState(0);

  // Altura del header de react-navigation
  const headerHeight = useHeaderHeight();

  //const theme = useSelector(state => state.theme.actual);

  useEffect(() => {
  }, [])
  

  const moreLoading = useSelector(state => state.status.moreLoading);
  const noMore = useSelector(state => state.status.noMore);
  const offset = useSelector(state => state.status.offset);
  const error = useSelector(state => state.status.error);
  const load = useSelector(state => state.status.load)

  const selectSong = (song) => {
      console.log('Cancion seleccionada: ' + song.trackName);
      dispatch(setIsSongSelected(true));
      dispatch(setSelectedSong(song));
  }

  const fetchMore = () => {
    if(offset > 0 && !moreLoading && !noMore && !error){
        console.log('buscando mas')
        dispatch(setLoad(true));
    }
  }

  const items = ({item}) => 
        <ListItem
          pressTheme
          icon={<Image source={{uri: item.artworkUrl60}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={item.artistName}
          onPress={_ => selectSong(item)}
        />

    const renderEmpty = () => (
        <View style={{height: height - headerHeight, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.alertText}>No se encontraron resultados</Text>
        </View>    
    )

    const renderFooter = () => (
        <View style={styles.footerText}>
            {moreLoading && <Spinner style={styles.centerText} size="large" />}
            {noMore && <Text style={styles.alertText}>No se encontraron mas resultados</Text>} 
        </View>
    )

  return (
    loaded && !error ?
        <View style={styles.main} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
          <FlashList
            contentContainerStyle={{paddingBottom: 70}}
            data={songs}
            renderItem={items}
            estimatedItemSize={25}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={fetchMore}
          />
        </View>
    
    
    : null

  )

})



const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexGrow: 1,
  },
  alertText: {
        width: '85%',
        fontSize: 20,
        textAlign: 'center',
  },
  centerText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
})

