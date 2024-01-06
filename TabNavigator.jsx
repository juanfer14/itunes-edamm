// Importo metodos de react
import React, { useEffect } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

// Componentes
import { DiscoverScreen } from './components/DiscoverScreen';
import { Favs } from './components/Favs';
import { Switch } from './components/Switch';

// Importo tabs, para navegar entre las screens de busqueda de
// artistas y las canciones favoritas de los artistas
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Iconos
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Obtengo del store, el valor de theme
import { useSelector, useDispatch } from 'react-redux';
import { toggle, setTheme } from './features/styles/themeSlice'

import { Mutex } from 'async-mutex';

const mutex = new Mutex();

// Se instancia el Tab
const Tab = createBottomTabNavigator();

// Icono para acceder a busquedas
const searchIcon = ({color, size}) => (
    <FontAwesome name="search" size={size} color={color} /> 
 );
 
 // Icono para acceder a favoritos
 const favIcon = ({color, size}) => (
    <FontAwesome name="heart" size={size} color={color} /> 
 );
 
 // Componente para generar el efecto de presion.
 const tabOpacity = (props) => <TouchableOpacity {...props} />



export function TabNavigator(){
    // Dispatch, utilizado para realizar cambios de tema
    const dispatch = useDispatch();

    // El tema que actualmente esta siendo utilizado de la store
    const theme = useSelector(state => state.theme.actual);
    // Termino para saber si esta en modo dark o no.
    const isDark = theme === 'dark';
    // Color que esta utilizando la barra de estado
    const colorStatus = isDark ? 'light' : 'dark';
    // Color que actualemnte esta utilizando el sistema
    const deviceColor = useColorScheme();

    // Funcion para alternar el tema actual, segun si el dispositivo cambia 
    // de modo noche a modo dia
    const setThemeStore = () => { dispatch(setTheme(deviceColor)); }

    // Cada vez que se cambia el color del sistema, se cambia a ese color
    useEffect(() => { 
        setThemeStore(); 
    }, [deviceColor]);

    // Nombre del icono que debe aparecer, para realizar el cambio 
    // entre modo dia y noche
    const nameIconSwitch = isDark ? 'moon' : 'sunny';

    // Funcion para cambiar de iconos en modo dia y modo noche
    const switchIcon = ({color, size}) => (
        <Ionicons name={nameIconSwitch} size={size} color={color} />
    );

    const cambiarTema = async() => await mutex.runExclusive(async () => dispatch(toggle()))

    // Componente para realizar el intercambio entre modo dia y modo noche
    const tabSwitch = (props) => <TouchableOpacity {...props} onPress={cambiarTema} />

    const nameSwitch = isDark ? 'Noche' : 'Dia';

    return (
        <Tab.Navigator initialRouteName="Discover" 
            screenOptions={{ 
                headerShown: false, 
                tabBarStyle: { height: 60 },
                tabBarLabelStyle: { fontSize: 16 }, // Ajusta el tamaño según tus preferencias
            }}  
		> 		
            <Tab.Screen name="Buscador" component={DiscoverScreen} 
                options={{ 
                    tabBarIcon: searchIcon, 
                    tabBarButton: tabOpacity, 
                    tabBarLabel: 'Buscador' 
                }} 
            />
            <Tab.Screen name="Favoritos" component={Favs} 
                options={{ 
                    tabBarIcon: favIcon, 
                    tabBarButton: tabOpacity, 
                    tabBarLabel: 'Favoritos',
                    headerShown: true,
                    


                }} 
            />
            <Tab.Screen name="Switch" component={Switch} 
                options={{ 
                    tabBarIcon: switchIcon, 
                    tabBarButton: tabSwitch, 
                    tabBarLabel: nameSwitch 
                }} 
            />
        </Tab.Navigator>
    )
}

export default TabNavigator;
