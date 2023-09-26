/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { Animated, Easing, View ,Image} from 'react-native';
import styled from 'styled-components';
import Emoji from 'react-native-emoji';
import { theme } from '../constants/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export interface IMonsterCard {
  monster: string;
  animate?: boolean;
}

const Box = styled(View)`
  border-width: 1px;
  width: ${wp('11.9%')}px;
  border-color: ${theme.palette.border};
  height: ${hp('6.25%')}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MonsterCard: FC<IMonsterCard> = ({ monster, animate }) => {
  const monsterAnimationOpacity = new Animated.Value(1);
  const monsterAnimationStyle = {
    opacity: monsterAnimationOpacity,
  };

  const animation = () => {
    Animated.sequence([
      Animated.delay(0),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(monsterAnimationOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  if (animate) animation();

  return (
    <>
      {monster === '0' ? (
        <Box />
      ) : (
        <Box>
          <Animated.View style={monsterAnimationStyle}>
            {/* <Emoji name={monster} style={{ fontSize: 30 }} /> */}
            <Image style={{width:40,height:40}} resizeMode={'contain'} source={require("../assets/images/greenInvader.png")}/>
          </Animated.View>
        </Box>
      )}
    </>
  );
};
