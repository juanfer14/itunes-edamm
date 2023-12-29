import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store';


import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'

import { Index } from './Index'

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Index/>
        </PersistGate>
      </Provider>
    </TamaguiProvider>
  )
}
