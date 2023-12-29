import React, { useState, useEffect } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

// Libreria para mantener el statusBar
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';
import { toggle, setTheme } from './features/styles/themeSlice'

// Importo tabs, para navegar entre las screens de busqueda de
// artistas y las canciones favoritas de los artistas
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Iconos
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

// Componentes
import { DiscoverScreen } from './components/DiscoverScreen';
import { Favs } from './components/Favs';
import { Switch } from './components/Switch';


// Temas
import { lightTheme, darkTheme } from './features/styles/themes'


const Tab = createBottomTabNavigator();

const searchIcon = ({color, size}) => (
   <FontAwesome name="search" size={size} color={color} /> 
);
const favIcon = ({color, size}) => (
   <FontAwesome name="heart" size={size} color={color} /> 
);
const switchIcon = ({color, size}) => (
   <MaterialCommunityIcons name="lightbulb-outline" size={size} color={color} /> 
);
const tabOpacity = (props) => <TouchableOpacity {...props} />


export function Index() {
  
  const color = useSelector(state => state.theme.actual);
  const deviceColor = useColorScheme();

  const dispatch = useDispatch();

  const setThemeStore = () => { dispatch(setTheme(deviceColor)); }
  useEffect(() => { setThemeStore(); }, [deviceColor]);


  const [colorStatus, setThemeStatus] = useState(color === 'dark' ? 'ligth' : 'dark');

  const checkColor = () => {
    dispatch(toggle());
    if(color === 'dark')
      setThemeStatus('dark')

    else
      setThemeStatus('light')

  }

  const tabSwitch = (props) => <TouchableOpacity {...props} onPress={checkColor} />



  return (
 		<SafeAreaProvider>
      	<NavigationContainer theme={color === 'dark' ? darkTheme : lightTheme}>
          	<Tab.Navigator initialRouteName="Discover" 
          		screenOptions={{ 
          			headerShown: false, 
          			tabBarStyle: { height: 60 } 
          		}}  
          	> 
              	<Tab.Screen name="DiscoverScreen" component={DiscoverScreen} 
              		options={{ 
              			tabBarIcon: searchIcon, 
              			tabBarButton: tabOpacity, 
              			tabBarLabel: '' 
              		}} 
              	/>
              	<Tab.Screen name="Favs" component={Favs} 
              		options={{ 
              			tabBarIcon: favIcon, 
              			tabBarButton: tabOpacity, 
              			tabBarLabel: '' 
              		}} 
              	/>
              	<Tab.Screen name="Switch" component={Switch} 
              		options={{ 
              			tabBarIcon: switchIcon, 
              			tabBarButton: tabSwitch, 
              			tabBarLabel: '' 
              		}} 
              	/>
            	</Tab.Navigator>
          </NavigationContainer>
         <StatusBar style={colorStatus} />
    </SafeAreaProvider>        
  );
}

export default Index;