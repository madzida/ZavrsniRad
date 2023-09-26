import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { Text } from './Text';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { theme } from '../../constants/Theme';

interface IHeaderProps {
  label: string;
  wizard?: {
    step: number;
    totalSteps: number;
  };
}

const Container = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5%;
  /* margin-bottom: -10%; */
`;

export const BackContainer = styled(TouchableOpacity)`
  height: ${hp('5.55%')}px;
  width: ${hp('5.55%')}px;
  display: flex;
  justify-content: center;
`;

export const Header: FC<IHeaderProps> = ({ label, wizard }) => {
  return (
    <Container>
      {wizard ? (
        <>
          <Text
            fontFamily={theme.fonts.arcade}
            fontSize={hp('1.5%')}
            color={theme.palette.lightPurple}
            textAlign="center"
          >
            STEP {wizard.step} OF {wizard.totalSteps}
          </Text>
          <Text
            fontFamily={theme.fonts.arcade}
            fontSize={hp('2.5%')}
            color={theme.palette.white}
            lineHeight={hp('3%')}
            textAlign="center"
          >
            {label}
          </Text>
        </>
      ) : (
        <Text fontFamily={theme.fonts.arcade} fontSize={hp('2%')} color={theme.palette.lightPurple} textAlign="center">
          {label}
        </Text>
      )}
    </Container>
  );
};
