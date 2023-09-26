import React from 'react';
import { StatusBar } from 'react-native';
import { useAuth } from '../auth/authContext';
import InvaderRow from '../components/InvaderRow';
import { ArcadeButton } from '../components/reusable-components/Button';
import { Background } from './login/ImageScreen';
import { HeaderContainer } from './login/NameScreen';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Header } from '../components/reusable-components/Header';
import { RootStackScreenProps } from '../navigation/root-navigator';

export default function HomeScreen({ navigation }: RootStackScreenProps<'HomeScreen'>) {
  const { signOut, student } = useAuth();
  return (
    <Background>
      <StatusBar hidden />

      <Header label={student.name} />
      <HeaderContainer>
        <InvaderRow />
      </HeaderContainer>
      <ArcadeButton onPress={() => navigation.push('GameScreen')} type="ternary" label="IGRA" fontSize={hp('5%')} />
      <HeaderContainer>
        <InvaderRow />
      </HeaderContainer>
      <ArcadeButton type="ternary" label="Odjava" onPress={() => signOut()} fontSize={hp('2%')} />
    </Background>
  );
}
