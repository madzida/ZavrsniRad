import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Image, StatusBar ,Vibration,StyleSheet} from 'react-native';
import { RootStackScreenProps } from '../../navigation/root-navigator';
import { Text } from '../../components/reusable-components/Text';
import { ArcadeButton } from '../../components/reusable-components/Button';
import { InputField } from '../../components/InputField';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { theme } from '../../constants/Theme';
import { useStudentsData } from '../../context/classContext';
import { AxiosInstance } from '../../auth/AxiosInstance';
const Wrapper = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  padding: 0 5%;
  height: 100%;
  background-color: ${theme.palette.blackestBlack};
`;
const InputContainer = styled(View)`
  display: flex;
  justify-content: space-around;
  height: 50%;
  margin-top: -10%;
`;

const Center = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled(View)`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 15%;
`;

const StyledImage = styled(Image)`
  height: 100%;
  width: 40%;
`;

export default function CodeScreen({ navigation }: RootStackScreenProps<'CodeScreen'>) {
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  const [classCode, setClassCode] = useState('');
  const [error,setError]=useState<any>(false)
  const { getClass, students } = useStudentsData();

  const validate = async () => {
    if (classCode === '') return false;
    return true;
  };

  //TODO refactor this

  const addToContext = async () => {
    Keyboard.dismiss();

    const formValid = await validate();
    if (formValid) {
      await getClass(classCode);
    } else {
      Vibration.vibrate();
      console.log('not valid');
    }
  };
  const onGoingTest = async (code:number) => {
    try{
    const res=await AxiosInstance.post('/test/checkOngoing', {
      classId:code
    });
    if(res.data.status===true){
      addToContext();
    }else{
      Vibration.vibrate();
      setError(true);
    }
  }catch(err){
    console.error(err);
  }
  };
  useEffect(() => {
    if (students.length !== 0) {
      navigation.navigate('NameScreen');
    }
  }, [navigation, students]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Wrapper>
        <StatusBar hidden />

        <ImageContainer>
          <StyledImage source={require('../../assets/images/invader.jpg')} />
        </ImageContainer>

        <InputContainer>
          <Text
            textAlign="center"
            fontFamily={theme.fonts.arcade}
            fontSize={hp('4%')}
            lineHeight={hp('5%')}
            color={theme.palette.linegrey}
          >
            Unesi oznaku razreda:
          </Text>
          <InputField borderRadius={25} value={classCode} onChange={setClassCode} keyboardType="number-pad" classId />
        </InputContainer>
        {error && <View style={styles.error_container}><Text style={styles.error}>NIJE POKRENUT TEST ZA UNESENI RAZRED</Text></View>}
        <Center>
          {/* <ArcadeButton onPress={addToContext} type="primary" label="UNESI" width="70%" /> */}
          <ArcadeButton onPress={()=>onGoingTest(parseInt(classCode))} type="primary" label="UNESI" width="70%" />
        </Center>
      </Wrapper>
    </TouchableWithoutFeedback>
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
