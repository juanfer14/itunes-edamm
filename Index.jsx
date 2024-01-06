
import { View } from 'react-native';

// Libreria para mantener el statusBar
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';


import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

// Temas
import { lightTheme, darkTheme } from './features/styles/themes'


import { Theme } from 'tamagui'
import { ToastProvider} from '@tamagui/toast'

import { TabNavigator } from './TabNavigator'
import { SongSelected } from './components/SongSelected';
import { SongDetail } from './components/SongDetail';

/* 
 * Stack de navegacion, para mostrar el detalle de la cancion
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export function Index() {

	// El tema que actualmente esta siendo utilizado de la store
    const theme = useSelector(state => state.theme.actual);
	const isSongSelected = useSelector(state => state.songs.isSongSelected)

    // Termino para saber si esta en modo dark o no.
    const isDark = theme === 'dark';
    // Color que esta utilizando la barra de estado
    const colorStatus = isDark ? 'light' : 'dark';

	const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

	const { left, top, right } = useSafeAreaInsets()

	

	return (
	<SafeAreaProvider>
		<NavigationContainer ref={navigationRef} theme={isDark ? darkTheme : lightTheme}>
			<ToastProvider top={top} left={left} right={right}>
				<Theme name={theme}>
					<View style={{flex:1, position: 'relative'}}>
						<Stack.Navigator initialRouteName='TabNavigator'>
							<Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
							<Stack.Screen name="SongDetail" component={SongDetail} options={{ headerShown: true, headerTitle: 'Detalle' }}/>
						</Stack.Navigator>
						{ isSongSelected ? 
							<SongSelected navigation={navigationRef}/>
							: null
						}
					</View>
				</Theme>
			</ToastProvider>
		</NavigationContainer>
		<StatusBar style={colorStatus} />	
	</SafeAreaProvider>        
  );
}

export default Index;