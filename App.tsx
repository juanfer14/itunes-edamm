import React, {useContext, createContext, useState} from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { StatusBar } from 'expo-status-bar';


import { DiscoverScreen } from './components/DiscoverScreen';
import { Favs } from './components/Favs';
import { Switch } from './components/Switch';

import { lightTheme, darkTheme } from './features/styles/themes'

// Importo tabs, para navegar entre las screens de busqueda de
// artistas y las canciones favoritas de los artistas
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'



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


export default function App() {
  
  const [color, setTheme] = useState(useColorScheme());
  const [colorStatus, setThemeStatus] = useState(color === 'dark' ? 'ligth' : 'dark');

  const checkColor = () => {
    if(color === 'dark'){
      setTheme('ligth')
      setThemeStatus('dark')
    }
    else{
      setTheme('dark')
      setThemeStatus('light')
    }
  }

  const tabSwitch = (props) => <TouchableOpacity {...props} onPress={checkColor} />
  

  return (
    <TamaguiProvider config={config}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer theme={color === 'dark' ? darkTheme : lightTheme}>
              <Tab.Navigator initialRouteName="DiscoverScreen" screenOptions={{ headerShown: false, tabBarStyle: { height: 60 } }}  > 
                <Tab.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ tabBarIcon: searchIcon, tabBarButton: tabOpacity, tabBarLabel: '' }} />
                <Tab.Screen name="Favs" component={Favs} options={{ tabBarIcon: favIcon, tabBarButton: tabOpacity, tabBarLabel: '' }} />
                {/*<Tab.Screen name="Example" component={SongItem} />*/}
                <Tab.Screen name="Switch" component={Switch} options={{ tabBarIcon: switchIcon, tabBarButton: tabSwitch, tabBarLabel: '' }} />
              </Tab.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
          <StatusBar style={colorStatus} />
          
        </PersistGate>
      </Provider>
    </TamaguiProvider>
  )
}
