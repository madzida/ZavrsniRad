/* import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components';
import { theme } from '../../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BUTTON_TYPE } from '../../constants/Constants';

interface IButton {
  label?: string | number;
  type: BUTTON_TYPE;
  onPress: () => any;
  backgroundColor?: string;
  color?: string;
  width?: string | number;
  icon?: object;
  disabled?: boolean;
}

export const CustomButton = styled(TouchableOpacity)<IButton>`
  min-height: ${hp('10%')}px;
  max-height: ${hp('10%')}px;
  /* height: 20%; 

  max-width: ${(p) => (p.width ? `${wp(p.width)}px` : `${wp('100%')}px`)};
  border-radius: ${hp('4.1%')}px;
  /* border-radius: 20px; 

  margin: ${hp('1.2%')}px;
  background-color: ${(p) => (p.backgroundColor ? p.backgroundColor : theme.components.button[p.type].background)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: ${(p) => theme.components.button[p.type].borderWidth};
  border-color: ${(p) => (p.color ? p.color : theme.components.button[p.type].color)};
  flex-grow: 1;
`;

export const CustomText = styled(Text)<IButton>`
  font-family: ${theme.fonts.interBold};
  font-size: ${hp('2.1%')}px;
  font-size: ${hp('5%')}px;

  color: ${(p) => (p.color ? p.color : theme.components.button[p.type].color)};
`;

const Button: FC<IButton> = ({ label, icon, disabled, ...props }) => {
  return (
    <CustomButton {...props} label={label} disabled={disabled}>
      <CustomText {...props} label={label}>
        {label}
        {icon}
      </CustomText>
    </CustomButton>
  );
};

Button.displayName = 'Button';

export default Button;
 */

import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components';
import { theme } from '../../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BUTTON_TYPE } from '../../constants/Constants';

interface IButton {
  label?: string | number;
  type: BUTTON_TYPE;
  onPress: () => any;
  backgroundColor?: string;
  color?: string;
  width?: string;
  icon?: object;
  fontFamily?: string;
  fontSize?: number;
  disabled?: boolean;
}

export const CustomButton = styled(TouchableOpacity)<IButton>`
  min-height: ${hp('6.8%')}px;
  max-height: ${hp('6.8%')}px;
  max-width: ${(p) => (p.width ? `${wp(p.width)}px` : `${wp('100%')}px`)};
  border-radius: ${hp('4.1%')}px;
  margin: ${hp('1.2%')}px;
  background-color: ${(p) => (p.backgroundColor ? p.backgroundColor : theme.components.button[p.type].background)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: ${(p) => theme.components.button[p.type].borderWidth};
  border-color: ${(p) => (p.color ? p.color : theme.components.button[p.type].color)};
  flex-grow: 1;
`;

const CustomArcadeButton = styled(CustomButton)`
  min-height: ${hp('8%')}px;
  max-height: ${hp('8%')}px;
  
`;

const CustomArcadeText = styled(Text)<IButton>`
  font-family: ${theme.fonts.arcade};
  color: ${theme.palette.white};
  font-size: ${(p) => (p.fontSize ? p.fontSize : theme.components.button[p.type].fontSize)}px;
`;

export const CustomText = styled(Text)<IButton>`
  font-family: ${(p) => (p.fontFamily ? p.fontFamily : theme.fonts.primary)};
  font-size: ${hp('2.1%')}px;
  color: ${(p) => (p.color ? p.color : theme.components.button[p.type].color)};
`;

const Button: FC<IButton> = ({ label, icon, ...props }) => {
  return (
    <CustomButton {...props} label={label}>
      <CustomText {...props} label={label}>
        {label}
        {icon}
      </CustomText>
    </CustomButton>
  );
};

export const ArcadeButton: FC<IButton> = ({ label, icon, ...props }) => {
  return (
    <CustomArcadeButton {...props} label={label}>
      <CustomArcadeText {...props} label={label}>
        {label}
        {icon}
      </CustomArcadeText>
    </CustomArcadeButton>
  );
};
Button.displayName = 'Button';

export default Button;
