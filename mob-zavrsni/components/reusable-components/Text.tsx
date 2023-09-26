/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import styled from 'styled-components';
import { Text as DefaultText } from 'react-native';
import React, { FC } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { theme } from '../../constants/Theme';

interface ITextProps {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  textAlign?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  color?: string;
}

const StyledText = styled(DefaultText)<ITextProps>`
  font-family: ${(p) => p.fontFamily || theme.fonts.primary};
  font-size: ${(p) => p.fontSize || hp('2%')}px;
  line-height: ${(p) => p.lineHeight || hp('2.5%')}px;
  text-align: ${(p) => p.textAlign || 'left'};
  margin-top: ${(p) => p.marginTop || 0}px;
  margin-bottom: ${(p) => p.marginBottom || 0}px;
  margin-left: ${(p) => p.marginLeft || 0}px;
  margin-right: ${(p) => p.marginRight || 0}px;
  padding-top: ${(p) => p.paddingTop || 0}px;
  padding-bottom: ${(p) => p.paddingBottom || 0}px;
  padding-left: ${(p) => p.paddingLeft || 0}px;
  padding-right: ${(p) => p.paddingRight || 0}px;
  color: ${(p) => p.color || theme.palette.ash};
`;

export const Text: FC<ITextProps> = ({ ...props }) => {
  return (
    <>
      <StyledText {...props}>{props.children}</StyledText>
    </>
  );
};
