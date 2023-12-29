//import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import React, { memo } from 'react'
import { Theme, ListItem,  Separator, XStack, YGroup, SizableText, YStack } from 'tamagui'
import {  View, StyleSheet} from 'react-native' 
import { Image } from 'expo-image';
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { FlashList } from "@shopify/flash-list";


export const SongItem = memo(() => {

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const theme = useSelector(state => state.theme.actual);
  const songs = useSelector(state => state.songs.songs);

  const items = ({item}) => 
        <ListItem
          hoverTheme
          pressTheme
          spaceFlex="true"
          icon={<Image source={{uri: item.artworkUrl60}} style={{ width: 60, height: 60 }} />}
          title={item.trackName}
          subTitle={item.artistName}
        />
      
  



  return (
    loaded ?
      <Theme name={theme}>
          <FlashList
            data={songs}
            renderItem={items}
            estimatedItemSize={50}
            
          />
      </Theme>  
    
    
    : null

  )

})



const styles = StyleSheet.create({
})

