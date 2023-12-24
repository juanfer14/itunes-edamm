import { Button, Text } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';


export function Search({ navigation }) {
    const route = useRoute();
    const { buscado } = route.params
    return ( 
        <SafeAreaView>
            <Button><Text>{ buscado }</Text></Button> 
        </SafeAreaView>
    )
}

export default Search;