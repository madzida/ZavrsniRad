import React, { useState } from 'react';
import { TouchableOpacity, View, StatusBar, Text,StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../../navigation/root-navigator';
import { ArcadeButton } from '../../components/reusable-components/Button';
import styled from 'styled-components';
import { useAuth } from '../../auth/authContext';
import { Header } from '../../components/reusable-components/Header';
import { theme } from '../../constants/Theme';
import { InputContainer } from '../../components/InputField';
import Emoji from 'react-native-emoji';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ImagesContainer = styled(View)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 5% 8.33%;
`;

export const Background = styled(View)`
  height: 100%;
  background-color: ${theme.palette.eerieBlack};
  display: flex;
  justify-content: space-between;
`;

const Center = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const emojis: string[] = [
  'elephant',
  'dog',
  'wolf',
  'fox_face',
  'cat',
  'frog',
  'tiger',
  'bird',
  'bear',
  'bat',
  'butterfly',
  'baby_chick',
  'crocodile',
  'dolphin',
  'fish',
  'monkey',
  'mouse',
  'octopus',
  'panda_face',
  'penguin',
  'rhinoceros',
  'snail',
  'snake',
  'turtle',
  'sheep',
];

export default function ImageScreen({ navigation }: RootStackScreenProps<'ImageScreen'>) {
  const { signIn, chooseImage,error } = useAuth();
  const [animal, setAnimal] = useState('');

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => <Header label="Select your animal" wizard={{ step: 2, totalSteps: 2 }} />,
  //   });
  // }, [navigation]);

  return (
    <Background>
      <StatusBar hidden />

      <Header label="Odaberi svoju ikonicu" wizard={{ step: 2, totalSteps: 2 }} />

      <>
        <ImagesContainer>
          {emojis.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => {
                chooseImage(emoji.toString());
                setAnimal(emoji);
              }}
            >
              <Emoji name={emoji} style={{ fontSize: wp('12.9%') }} />
            </TouchableOpacity>
          ))}
        </ImagesContainer>
        <Center>
          <InputContainer>{animal ? <Emoji name={animal} style={{ fontSize: 50 }} /> : null}</InputContainer>
        </Center>
      </>
      {error && <View style={styles.error_container}><Text style={styles.error}>NISTE UNIJELI DOBRU SLIČICU</Text></View>}
      <Center>
        <ArcadeButton onPress={signIn} type="primary" label="UNESI" width="70%" />
      </Center>
      <ArcadeButton type="ternary" label="Prethodna stranica" onPress={() => navigation.goBack()} fontSize={hp('1.5%')} />
    </Background>
  );
}
const styles = StyleSheet.create({
  error_container:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error:{
    color:"red",
    fontWeight:'bold',
  },
});
