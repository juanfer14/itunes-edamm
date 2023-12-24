import 'ts-node/register' // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';
const config: ExpoConfig = {
  "name": "itunes-edamm",
  "slug": "itunes-edamm",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "automatic",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  },
  "web": {
    "favicon": "./assets/favicon.png"
  }
};

export default config;
