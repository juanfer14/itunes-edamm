// Importo metodos de react
import React, { useEffect, useState } from 'react';
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
import { toggle, setTheme, setLoading } from './features/styles/themeSlice'

import { Mutex } from 'async-mutex';

import { useMutex } from 'react-context-mutex';

import { Spinner } from 'tamagui'
import { setLoad } from './features/status/statusSlice';

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
    const [nameIconSwitch, setNameIconSwitch] = useState('moon');
    const [nameSwitch, setNameSwitch] = useState('Oscuro');
    const [isLoading, setIsLoading] = useState(false);
    // Dispatch, utilizado para realizar cambios de tema
    const dispatch = useDispatch();

    // Color que actualemnte esta utilizando el sistema
    const deviceColor = useColorScheme();

    const isDark = useSelector(state => state.theme.isDark);
    const loading = useSelector(state => state.theme.loading)

    const MutexRunner = useMutex();
    const mutex = new MutexRunner('myUniqueKey1');


    // Cada vez que se cambia el color del sistema, se cambia a ese color
    useEffect(() => { 
        dispatch(setTheme(deviceColor));
    }, [deviceColor]);

    useEffect(() => {
        const NameIconSwitch = isDark ? 'moon' : 'sunny';
        const NameColorSwitch = isDark ? 'Oscuro' : 'Claro';
        setNameIconSwitch(NameIconSwitch);
        setNameSwitch(NameColorSwitch);
        
    }, [isDark])

    useEffect(() => {
        setIsLoading(loading);
    }, [loading])


    // Funcion para cambiar de iconos en modo dia y modo noche
    const switchIcon = ({color, size}) => (
        isLoading ? 
            <Spinner/>
        : 
            <Ionicons name={nameIconSwitch} size={size} color={color} />
    );

    const cambiarTema = () => {
        if(isLoading) return;
        dispatch(setLoading(true));
        
        mutex.run(async () => {
            mutex.lock();
            try {
                dispatch(toggle());   
                
            } catch(e){
                console.log(e);
            } finally {
                
                mutex.unlock();
                         
            }
        })
    }

    // Componente para realizar el intercambio entre modo dia y modo noche
    const tabSwitch = (props) => <TouchableOpacity {...props} onPress={cambiarTema} />


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
