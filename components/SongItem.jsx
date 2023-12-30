//import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import React, { memo } from 'react'
import { Theme, ListItem,  Separator, XStack, YGroup, SizableText, YStack } from 'tamagui'
import {  View, StyleSheet} from 'react-native' 
import { Image } from 'expo-image';
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { FlashList } from "@shopify/flash-list";

import { useHeaderHeight, ThemeProvider } from '@react-navigation/elements';

export const SongItem = memo(() => {

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Permite ajustar la altura, cuando no se obtienen resultados o hay error 
  const [height, setHeight] = useState(0);

  // Altura del header de react-navigation
  const headerHeight = useHeaderHeight();

  const theme = useSelector(state => state.theme.actual);
  const songs = useSelector(state => state.songs.songs);

  const items = ({item}) => 
        <ListItem
          hoverTheme
          pressTheme
          icon={<Image source={{uri: item.artworkUrl60}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={item.artistName}
        />

  const renderEmpty = () => (
      <View style={{height: height - headerHeight, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.alertText}>No se encontraron resultados</Text>
      </View>    
  )


  const renderFooter = () => (
      <View style={styles.footerText}>
          {moreLoading && <Spinner style={styles.centerText} size="large" />}
          {noMore && <Text>No se encontraron mas resultados</Text>} 
      </View>
  )
      

  return (
    loaded ?
        <View onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
          <FlashList
            data={songs}
            renderItem={items}
            estimatedItemSize={25}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={fetchMore}
          />
        </View>
    
    
    : null

  )

})



const styles = StyleSheet.create({
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
})

