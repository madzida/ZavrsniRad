import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AxiosInstance } from '../auth/AxiosInstance';
import { IMonsterCard } from '../components/MonsterCard';

export interface IGame {
  board: IMonsterCard[];
}

interface IGameContext {
  board: IMonsterCard[];
  gameOver: boolean;
  win:boolean;
}

interface IGameMethods {
  moveDown: () => boolean;
  shooting: () => Promise<void>;
  startGame: () => void;
}

interface IGameProvider {
  children: React.ReactNode;
}

const initialGameData: IGameContext = {
  board: [],
  gameOver: false,
  win:false,
};

const monsters: string[] = [
  'space_invader',
  'skull_and_crossbones',
  'japanese_ogre',
  'skull',
  'ghost',
  'smiling_imp',
  'japanese_goblin',
  'alien',
];

interface IGameData extends IGameContext, IGameMethods {}

export default function GameProvider({ children }: IGameProvider): React.ReactElement {
  const initializeEmptyBoard = () => {
    //napravi polje sa velicinom 1
    let gameBoard: IMonsterCard[] = [{ monster: '0' }];
    //dodaj 63 nule da polje bude 64
    for (let i = 0; i < 63; ++i) {
      gameBoard.push({ monster: '0' });
    }
    return gameBoard;
  };

  const [board, setBoard] = useState<IMonsterCard[]>(initializeEmptyBoard());
  const [totalTimeTaken, setTotalTimeTaken] = useState(Date.now());
  const [timer, setTimer] = useState(Date.now());
  const [time, setTime] = useState(0);
  const [result, setResult] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flag, setFlag] = useState(false);
  const [win, setWin] = useState(false);
  const startGame = () => {
    setGameOver(false);
    setWin(false)
    setTimer(Date.now());
    setTotalTimeTaken(Date.now());
    setFlag(false);
    setResult(0);
    initializeBoard();
  };

  const initializeBoard = () => {
    let gameBoard = initializeEmptyBoard();
    //inicijaliziraj 10 cudovista (oznake cudovista 1,2,3,4) u prva 3 reda
    for (let i = 0; i < 10; ++i) {
      let position = Math.floor(Math.random() * 24);
      let monster = Math.floor(Math.random() * 8);
      if (gameBoard[position].monster === '0') {
        gameBoard[position].monster = monsters[monster];
      } else {
        --i;
      }
    }
    //inicijaliziraj jednog nekog u 4. red 🙂
    let pozicija = 24 + Math.floor(Math.random() * 8);
    gameBoard[pozicija].monster = monsters[Math.floor(Math.random() * 8)];
    setBoard(gameBoard);
    return gameBoard;
  };
  const shooting = async () => {
    let gameBoard = board;
    let enemyKilled = false;
    // setTime(Date.now() - timer);
    // setTimer(Date.now());

      for (let i = 64-1; i >= 0; i -= 1) {
        if (gameBoard[i].monster !== '0') {
          //1. moram zatreperiti
          gameBoard[i].animate = true;
          setBoard(gameBoard);

          //2. moram pricekati da zatreperi

          function wait() {
            gameBoard[i].animate = false;
            gameBoard[i].monster = '0';
            setBoard(gameBoard);
            checkGameOver();
          }
          setTimeout(wait,500);
          //3. moram ga ubiti

          //4. moram poslat rezultate
          setResult(result + 1);
          setBoard(gameBoard);
          enemyKilled = true;
          break;
        }
      }
  };

  const sendResult = async (expression: string, enemyKilled: boolean) => {
    await AxiosInstance.post('/test/testEntry', {
      calculation: expression,
      enemyKilled: enemyKilled,
      timeTaken: Math.floor(time / 1000),
    });
  };

  function checkGameOver() {
    let gameBoard = board;

    for (let i = 0; i < 64; i++) {
      if (gameBoard[i].monster !== '0') {
        return false;
      }
    }
    setWin(true);
    setGameOver(true);
    setFlag(true);
    setBoard(initializeEmptyBoard());
  }

  function moveDown() {

    let gameBoard = board;
    for (let i = 56; i < 64; ++i) {
      if (gameBoard[i].monster !== '0') {
        setGameOver(true);
        sendFinalResult();
        return true;
      }
    }

    for (let i = 63; i >= 8; --i) {
      gameBoard[i].monster = gameBoard[i - 8].monster;
    }
    for (let i = 0; i < 8; ++i) {
      gameBoard[i].monster = '0';
    }
    setBoard(gameBoard);
    return false;
  }

  const sendFinalResult = useCallback(async () => {
    await AxiosInstance.post('/test/testResult', {
      result: result,
      totalTimeTaken: Math.floor((Date.now()-totalTimeTaken )/ 1000),
    });
  }, [result, totalTimeTaken]);

  useEffect(() => {
    if (flag) {
      sendFinalResult();
    }
  }, [flag]);

  return (
    <GameContext.Provider value={{ startGame, board, moveDown, shooting, gameOver,win}}>{children}</GameContext.Provider>
  );
}

export const GameContext = createContext(initialGameData as IGameData);

export const useGameData = (): IGameData => useContext(GameContext);
