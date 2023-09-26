import { View } from 'react-native';
import React from 'react';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { invaders } from '../assets/assets.icons';

const ImageContainer = styled(View)`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledImage = styled(View)`
  height: ${hp('15%')}px;
  width: ${wp('18%')}px;
`;

export default function InvaderRow() {
  return (
    <ImageContainer>
      <StyledImage>
        <invaders.purpleInvader />
      </StyledImage>
      <StyledImage>
        <invaders.purpleInvader />
      </StyledImage>
      <StyledImage>
        <invaders.purpleInvader />
      </StyledImage>
    </ImageContainer>
  );
}
