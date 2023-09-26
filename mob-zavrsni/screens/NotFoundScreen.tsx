import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackScreenProps } from '../navigation/root-navigator';

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  return (
    <View>
      <Text>{"This screen doesn't exist."}</Text>
      <TouchableOpacity onPress={() => navigation.push('HomeScreen')}>
        <Text>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}
