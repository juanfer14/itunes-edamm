// Importo componentes de react native
import { View, StyleSheet,  TouchableOpacity} from 'react-native';

// Importo metodos del store y slices
import { useSelector, useDispatch } from 'react-redux';
import { setOffset } from '../features/status/statusSlice'
import { setTerm, setIsSongSelected } from '../features/songs/songSlice';

// Importo iconos
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importo Input de react-native
import { Input } from '@rneui/themed';

export  function InputFetch(){

    const dispatch = useDispatch();

    // Termino a buscar
    const term = useSelector(state => state.songs.termSearch)
    const theme = useSelector(state => state.theme.actual);

    const cambiarText = (text) => {
        dispatch(setOffset(0));
        dispatch(setTerm(text));
        dispatch(setIsSongSelected(false));
    }

    return (
        <Input
            style={{fontSize: 25, color: theme === 'dark' ? 'white' : 'black'}}
            containerStyle={{height: 30, bottom: 25}}
            value={term}
            onChangeText={cambiarText}
            rightIcon={
                term ? 
                    <TouchableOpacity onPress={() => cambiarText('')} >
                        <Icon name="close-circle-outline" size={40} color="gray" />
                    </TouchableOpacity> 
                : null
            }
        />
    )
}

export default InputFetch;