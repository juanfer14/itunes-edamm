
import React, { useState } from 'react'
import { View } from 'react-native';

// Libreria para mantener el statusBar
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';


import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

// Temas
import { lightTheme, darkTheme } from './features/styles/themes'

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Theme } from 'tamagui'


import { TabNavigator } from './TabNavigator'
import { SongSelected } from './components/SongSelected';
import { SongDetail } from './components/SongDetail';

/* 
 * Stack de navegacion, para mostrar el detalle de la cancion
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

import { useMutex } from 'react-context-mutex';

import { setLoading } from './features/styles/themeSlice'


export function Index() {

	
	const isSongSelected = useSelector(state => state.songs.isSongSelected)
	const isDark = useSelector(state => state.theme.isDark);

	// Termino para saber si esta en modo dark o no.
	const [themeNavigation, setThemeNavigation] = useState('');
	const [themeTamagui, setThemeTamagui] = useState('');
	// Color que esta utilizando la barra de estado
	const [colorStatus, setColorStatus] = useState('');

	const MutexRunner = useMutex();

	const dispatch = useDispatch();
    

	useEffect(() => {
		const mutex = new MutexRunner('myUniqueKey1');
		
		mutex.run(async() => {
			mutex.lock();
			try {
				if(isDark){
					setThemeNavigation(darkTheme);
					setThemeTamagui('dark');
					setColorStatus('light');
				} else {
					setThemeNavigation(lightTheme);
					setThemeTamagui('light');
					setColorStatus('dark');
				}	
				
			} catch(e){
				console.log(e);
			} finally {
				mutex.unlock();
				setTimeout(() => {
					dispatch(setLoading(false));
				}, 1000)
				
			}
		})
		
	}, [isDark])

	const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

	return (
	<SafeAreaProvider>
		<NavigationContainer ref={navigationRef} theme={themeNavigation}>
			<GestureHandlerRootView style={{flex:1}}>
			<Theme name={themeTamagui}>
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
			</GestureHandlerRootView>
		</NavigationContainer>
		<StatusBar style={colorStatus} />	
	</SafeAreaProvider>        
  );
}

export default Index;