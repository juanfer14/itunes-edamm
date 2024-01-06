import { View, StyleSheet } from 'react-native'
// Importo fonts para tamagui
import { useFonts } from "expo-font";
import { Button, Text, Theme } from 'tamagui'

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';



export function SongDetail(){
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    // El tema que actualmente esta siendo utilizado de la store
    const theme = useSelector(state => state.theme.actual);
    // Termino para saber si esta en modo dark o no.
    const isDark = theme === 'dark';

    return (
        loaded ? 
            <View style={styles.main}>
                <Theme name="blue">
                    <Button 
                        iconAfter={<Icon name="share-social-sharp" size={30} color={'white'} />}
                        style={styles.button}
                        size="$1"
                        theme="active"
                        themeInverse
                        
                    >
                        <Text style={{color: 'white', fontSize: 19}}>Compartir</Text>
                    </Button>
                </Theme>
                
            </View>
        : null
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexGrow: 1
    },
    button: {
        height: 60,
        position: 'absolute',
        bottom: 0,
        width: "100%",   
    }
})

export default SongDetail;