//import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'

import { ListItem,  Separator, XStack, YGroup, SizableText, YStack } from 'tamagui'
import { Image, View, StyleSheet} from 'react-native' 
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';



export function SongItem( { songs } ) {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });



  return (
    loaded ?
    <YGroup alignSelf="center" width={"95%"} bordered size="$5" separator={<Separator />} >
        { songs.map((song, index) => (
          <YGroup.Item key={index}>
            <ListItem
              hoverTheme
              pressTheme
              spaceFlex="true"
              icon={<Image source={{uri: song.artworkUrl60}} style={{ width: 60, height: 60 }} />}
              title={song.trackName}
              subTitle={song.artistName}
            />
          </YGroup.Item>
      ))}
        
    </YGroup>   
    
    : null

  )

}

const styles = StyleSheet.create({
})