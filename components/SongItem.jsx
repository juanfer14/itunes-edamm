//import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'

import { ListItem,  Separator, XStack, YGroup } from 'tamagui'
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';



export function SongItem() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  return (
    
    loaded ?
    <SafeAreaView>

    <YGroup alignSelf="center" bordered width={360} size="$5" separator={<Separator />}>

      <YGroup.Item>

        <ListItem
          hoverTheme
          pressTheme
          title="Star"
          subTitle="Subtitle"
      
        />

      </YGroup.Item>

      <YGroup.Item>

        <ListItem
          hoverTheme
          pressTheme
          title="Moon"
          subTitle="Subtitle"
          
        />

      </YGroup.Item>

    </YGroup>
    </SafeAreaView>

    : null

  )

}

