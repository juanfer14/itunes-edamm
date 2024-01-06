import { View, StyleSheet,  TouchableOpacity} from 'react-native';

// Importo componente de librerias
import { Button, Text, Spinner } from 'tamagui'

import { useSelector, useDispatch} from 'react-redux'

import { setLoad } from '../features/status/statusSlice'

// Importo fonts para tamagui
import { useFonts } from "expo-font";

export function Retry(){
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    const disptach = useDispatch();

    const error = useSelector(state => state.status.error)

    const cargar = () => disptach(setLoad(true))

    return (
        loaded && error ?
            <View style={styles.center}>
                <Text style={styles.alertText} >Hubo un error en la conexion </Text>
                <Button onPress={cargar}><Text>Intentar de nuevo</Text></Button>
            </View>
        : null
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertText: {
        width: '85%',
        fontSize: 20,
        textAlign: 'center',
    }
    
})

export default Retry;