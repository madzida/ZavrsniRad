import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  NotFound: undefined;
  CodeScreen: undefined;
  NameScreen: undefined;
  ImageScreen: { student: string };
  GameScreen: undefined;
  HomeScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;
