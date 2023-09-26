import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from './root-navigator';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      NotFound: '*',
      CodeScreen: 'code',
      NameScreen: 'name',
      ImageScreen: 'image',
      GameScreen: 'game',
      HomeScreen: 'welcome',
    },
  },
};

export default linking;
