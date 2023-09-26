import * as React from 'react';
import { FlatList, StatusBar, TouchableOpacity, View } from 'react-native';
import { RootStackScreenProps } from '../../navigation/root-navigator';
import { Text } from '../../components/reusable-components/Text';
import { ArcadeButton } from '../../components/reusable-components/Button';
import { useStudentsData } from '../../context/classContext';
import styled from 'styled-components';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { theme } from '../../constants/Theme';
import { useAuth } from '../../auth/authContext';
import { Header } from '../../components/reusable-components/Header';
import InvaderRow from '../../components/InvaderRow';

const Background = styled(View)`
  height: 100%;
  background-color: ${theme.palette.eerieBlack};
`;

export const HeaderContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7% 0;
`;

export default function NameScreen({ navigation }: RootStackScreenProps<'NameScreen'>) {
  const { students } = useStudentsData();
  const { chooseName } = useAuth();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        chooseName(item.studentId);
        navigation.navigate('ImageScreen', { student: item.name });
      }}
    >
      <Text
        fontSize={hp('3%')}
        lineHeight={hp('6%')}
        textAlign="center"
        color={theme.palette.white}
        fontFamily={theme.fonts.arcade}
      >
        {item.name} {item.surname}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Background>
      <StatusBar hidden />
      <>
        <Header label="Odaberi svoje ime" wizard={{ step: 1, totalSteps: 2 }} />
        <HeaderContainer>
          <InvaderRow />
        </HeaderContainer>

        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.studentId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: theme.palette.black }}
        />
        <HeaderContainer>
          <InvaderRow />
        </HeaderContainer>
        <ArcadeButton type="ternary" label="Prethodna stranica" onPress={() => navigation.goBack()} fontSize={hp('1.5%')} />
      </>
    </Background>
  );
}
