/* Instancio el stack de navegacion, para que solamente se
 * agregue una nueva ventana, cuando el usuario seleccione
 * una de las posibles canciones del artista
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Discover } from './Discover';
import { Search } from './Search';



const Stack = createNativeStackNavigator();

export function DiscoverScreen(){

    return (
        <Stack.Navigator initialRouteName="Discover">
            <Stack.Screen name="Discover" component={Discover} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="Search" component={Search}></Stack.Screen>
        </Stack.Navigator>
    )

}

export default DiscoverScreen;