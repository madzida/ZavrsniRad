/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import { View, Text, StatusBar, Modal, TouchableOpacity, Vibration,TextInput,StyleSheet,Image ,ImageBackground} from 'react-native';

import { RootStackScreenProps } from '../navigation/root-navigator';
import Button, { ArcadeButton } from '../components/reusable-components/Button';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../auth/authContext';
import { Board } from '../components/Board';
import { useGameData } from '../context/gameContext';
import { theme } from '../constants/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InputContainer } from '../components/InputField';
import { AxiosInstance } from '../auth/AxiosInstance';
import { color } from 'react-native-reanimated';
import { invaders } from '../assets/assets.icons';
import {images} from './images';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
interface IDice {
  name: string;
  number: number;
  disabled: boolean;
}

const CenteredView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 3%;
`;

const ModalView = styled(View)`
  margin: 20px;
  background-color: ${theme.palette.gainsboro};
  border-radius: 20px;
  padding: 10% 3%;
  align-items: center;
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
  width: 80%;
  height: 60%;
  elevation: 7;
  display: flex;
  justify-content: space-between;
`;
const ModalViewGameOver = styled(View)`
  margin: 20px;
  background-color: ${theme.palette.gainsboro};
  border-radius: 20px;
  padding: 10% 3%;
  align-items: center;
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
  width: 80%;
  height: 40%;
  elevation: 7;
  display: flex;
  justify-content: space-between;
`;

const StartButton = styled(TouchableOpacity)`
  height: 20%;
  border-radius: 20px;
  background-color: ${theme.palette.purple};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5%;
  margin-top: ${hp('10%')}px;
`;

const StartButtonText = styled(Text)`
  font-size: ${hp('4%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.arcade};
`;

const ReadyText = styled(Text)`
  color: ${theme.palette.skobeloff};
  font-family: ${theme.fonts.arcade}
  font-size: ${hp('2.8%')}px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: ${hp('5%')}px;;
`;

const Warning = styled(Text)`
  color: ${theme.palette.ash};
  font-family: ${theme.fonts.arcade}
  font-size: ${hp('2%')}px;
  text-transform: uppercase;
`;





export default function GameScreen({ navigation }: RootStackScreenProps<'GameScreen'>) {
  const { moveDown, shooting, startGame, gameOver ,win} = useGameData();
  const [data,setData]=useState<any>([]);
  const [currentQuestion,setCurrentQuestion]=useState<any>([]);
  const [currentNumber,setNumber]=useState<any>();
  const [inputText,setInputText]=useState<any>({text:""});
  const [timer, setTimer] = useState(Date.now());
  const [start,setStart]=useState(false);
  const [timer2, setTimer2] = useState(0);
  const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  const [modalVisible, setModalVisible] = useState(true);
  const [modalGameOver, setModalGameOver] = useState(false);
  const [shootingCounter, setShootingCounter] = useState(1);
  const [imagePath,setImagePath] = useState({path: images('default')})
  const { signOut, student } = useAuth();
  useEffect(() => {
    if (gameOver) {
      setModalGameOver(true);
      setShootingCounter(1);
    }
  }, [win,gameOver]);
  useEffect(() => {
    setModalGameOver(false)
    if(Object.keys(data).length!=0){
      setCurrentQuestion(data[0]);
      setTimer(Date.now());
      setNumber(0);
      
    }
  }, [data]);
  useEffect(() => {
    async function getResults() {
    await AxiosInstance.get('/test/testQuestions').then((response) => {
      setData(response.data)
    }, (error) => {
      console.log(error);
    });;
  }
  getResults()
  }, []);
  useEffect(()=>{
    const interval = setInterval(() => {
        setTimer2(current=>current+1)
      }, 1000);
    return () => clearInterval(interval);
  },[])
  useEffect(()=>{
    if((timer2+5)%25===0 && timer2!==0 && start){
      function wait() {
        moveDown();
      }
      setTimeout(wait,5000);
    }
  },[timer2])


  const sendResult = async (submited:string,expression: string, enemyKilled: boolean,time:any) => {
    await AxiosInstance.post('/test/testEntry', {
      calculation: submited,
      enemyKilled: enemyKilled,
      timeTaken: Math.floor(time),
      question: expression,
    });
  };
  const skipQuestion = () => {
    let numb=currentNumber;
    setCurrentQuestion((prevState:any) => ({
      ...prevState,
      image: null}));
    sendResult("**preskočeno pitanje**",currentQuestion.question,false,((Date.now() - timer)/1000));
    setShootingCounter(shootingCounter + 1);
    if((numb+1)!=Object.keys(data).length){
      setTimeout(changeQuestion,700)
    }else{
      console.log("dosla do kraja pitanja")
      setModalGameOver(true);
      setShootingCounter(1);
    }
  };
  const handleSubmit = (submit:string) => {
  if((submit.trim().toLowerCase())!=(currentQuestion.correct.trim().toLowerCase())){
    Vibration.vibrate();
    sendResult(submit.trim(),currentQuestion.question,false,((Date.now() - timer)/1000));
    setShootingCounter(shootingCounter + 1);
 }
  else{
    setCurrentQuestion((prevState:any) => ({
      ...prevState,
      image: null}));
    let numb=currentNumber;
    sendResult(submit.trim(),currentQuestion.question,true,((Date.now() - timer)/1000));
    setShootingCounter(shootingCounter + 1);
    evaluate();
    if((numb+1)!=Object.keys(data).length){
      setTimeout(changeQuestion,1200)
    }else{
      console.log("dosla do kraja pitanja")
      setModalGameOver(true);
      setShootingCounter(1);
    }
  }
  };
  const changeQuestion=()=>{
    let numb=currentNumber;
    setCurrentQuestion(data[numb+1]);
    setTimer(Date.now());
    setNumber(numb+1);
    setInputText({text:""})
  }
  const evaluate = () => {
      try {
        shooting();
      } catch {
        Vibration.vibrate();
      }

  };


  useEffect(() => {
    setImagePath({
      path: images(currentQuestion.image)
    });
  },[currentQuestion])

  const setText=(text: string)=>{
    setInputText({text:text})
  }
  return (
    <ImageBackground source={require( "../assets/images/background.png" )} resizeMode="cover" style={styles.image}>
      <StatusBar hidden />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <CenteredView>
          <ModalView>
            <ReadyText>Jeste li spremni?</ReadyText>
            <View>
              <Warning>Obranite galaksiju svojim znanjem.</Warning>
              <Warning />
              <Warning>Svakim ispravnim odgovorom Space invader-a je sve manje</Warning>
            </View>
            <>
              <StartButton
                onPress={() => {
                  setModalVisible(false);
                  startGame();
                  setTimer2(0);
                  setStart(true);
                }}
              >
                <StartButtonText>START</StartButtonText>
              </StartButton>
              <ArcadeButton type="ternary" label="Prethodna stranica" onPress={() =>{ navigation.goBack()}} fontSize={hp('1.5%')} />
            </>
          </ModalView>
        </CenteredView>
      </Modal>
      {modalGameOver===true && <Modal
        animationType="slide"
        transparent={true}
        visible={modalGameOver}
        onRequestClose={() => {
          setModalGameOver(false);
        }}
      >
      <CenteredView>
          <ModalViewGameOver>
            {(win===false) &&<ReadyText>NEUSPJELA OBRANA GALAKSIJE</ReadyText>}
            {(win===true) &&<ReadyText>GALAKSIJA OBRANJENA</ReadyText>}
            <>
            <View style={styles.arcade_buttons}>
              <TouchableOpacity style={styles.arcade_button} onPress={() =>{signOut();setModalGameOver(false)}} ><Text style={styles.arcade_text}>Odjava</Text></TouchableOpacity>
              <TouchableOpacity onPress={() =>{ navigation.goBack()}} ><Text style={styles.arcade_text}>Prethodna stranica</Text></TouchableOpacity></View>
            </>
          </ModalViewGameOver>
        </CenteredView>
        </Modal>}
      {Object.keys(currentQuestion).length!=0 && 
      <View>
      {currentQuestion.image==null &&<Board/>}
      {currentQuestion.image!=null && <Image style={styles.image_container} resizeMode={'contain'} source={imagePath.path}/>}
      <View style={styles.container}>
      <View><Text style={styles.question}>{currentQuestion.question} </Text></View>
      {(Object.keys(currentQuestion.suggested).length==0)?  (
      <View style={styles.input_container}>
      {(isNaN(currentQuestion.correct)===true) && (<TextInput
        placeholder="Unesite točan odgovor"
        onChangeText={(text) =>setText(text)}
        value={inputText.text}
        style={[styles.input]}
      />)}
      {(isNaN(currentQuestion.correct)===false) && (<TextInput
        placeholder="Unesite točan odgovor"
        onChangeText={(text) =>setText(text)}
        value={inputText.text}
        keyboardType='numeric'
        style={[styles.input]}
      />)}
        <TouchableOpacity style={[styles.input_button]} onPress={()=>{handleSubmit(inputText.text)}}><Text style={styles.suggested_text}>Predaj odgovor</Text></TouchableOpacity>
      </View> )
      : (<View style={styles.button_container}>
        {currentQuestion.suggested.map((item: string, i:number) => (
            <TouchableOpacity key={i} style={[styles.suggested_button]} onPress={()=>handleSubmit(item)}><Text style={styles.suggested_text}>{item}</Text></TouchableOpacity>
          ))}
            </View>)}
        </View>
        </View>}
      <TouchableOpacity style={styles.button} onPress={skipQuestion}><Text style={styles.button_text}>Preskoči pitanje</Text></TouchableOpacity>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  question:{
    fontSize:22,
    marginBottom:10,
    color:'white',
  },
  button: {
    position: 'absolute',
    bottom: 10,
    width:"45%",
    height:30,
    alignSelf:'center',
    borderRadius:5,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.45)',
  },
  button_text:{
    fontSize:20,
    fontWeight:'bold',
    color:'rgba(45, 214, 107,1)',
  },
  image: {
    flex: 1,
    //opacity:0,
  },
  suggested_text:{
    fontSize:20,
    fontWeight:'bold',
    color:'white',
  },
  input_container:{
    width:'85%',
    marginTop:30,
  },
  image_container:{
    width:'95%',
    height:'55%',
    alignSelf:'center',
    margin:10,
  },
  input_button:{
    width:"50%",
    height:40,
    margin:40,
    alignSelf:'center',
    borderRadius:5,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(45, 214, 107,1)',
  },
  suggested_button:{
    backgroundColor:'rgba(45, 214, 107,1)',
    borderRadius:5,
    margin:10,
    height:50,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button_container:{
    display:'flex',
    //flex: 1,
    width:'95%',
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize:15,
    height:38,
    color:'rgba(255, 255, 255,1)',
    backgroundColor:'rgba(45, 214, 107,0.7)',
  },
  arcade_buttons:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  arcade_button:{
    backgroundColor:'rgba(45, 214, 107,1)',
    borderRadius:5,
    height:43,
    width:150,
    marginBottom:3,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arcade_text:{
    fontSize:20,
    color:'white',
    margin:5,
    fontWeight:'bold'
  }



});
