import React, { FC } from 'react';
import { View, TextInput, ViewStyle, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface IInputFieldProps extends Partial<ViewStyle> {
  value: string;
  onChange?: (value: string) => void;
  onChangeEnd?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: string;
  classId?: boolean;
}

const Input = styled(TextInput)`
  flex: 1;
  color: ${theme.palette.tundora};
  font-family: ${theme.fonts.arcade};
  font-size: ${hp('7%')}px;
  text-align: center;
`;

export const InputContainer = styled(View)<Partial<ViewStyle>>`
  width: ${wp('60%')}px;
  height: ${hp('10.55%')}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${theme.palette.blackestBlack};
  padding-left: ${wp('5.9%')}px;
  padding: 0 ${wp('5.9%')}px;
  margin-bottom: 3%;
  border-width: 5px;
  border-color: ${theme.palette.linegrey};
  border-radius: 25px;
`;

const Container = styled(View)`
  margin: ${wp('2%')}px auto;
`;

export const InputField: FC<IInputFieldProps> = ({
  value,
  onChange,
  onChangeEnd,
  placeholder,
  editable,
  classId,
  ...props
}) => {
  return (
    <Container>
      <InputContainer style={{ ...props }}>
        {classId ? (
          <Input
            placeholder={placeholder}
            placeholderTextColor="#9a9a9a"
            autoCorrect={false}
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onEndEditing={onChangeEnd}
            editable={editable}
            maxLength={6}
            keyboardType="numeric"
          />
        ) : (
          <Input
            placeholder={placeholder}
            placeholderTextColor="#9a9a9a"
            autoCorrect={false}
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onEndEditing={onChangeEnd}
            editable={editable}
          />
        )}
      </InputContainer>
    </Container>
  );
};

/*HOW TO USE -> 
    on the screen that uses searchbar, define   

    const [searchTerm, setSearchTerm] = useState("");

    and then call the searchbar like this: 

    <InputField
        icon={'search'}
        value={setSearchTerm}
        onChange={setTerm}
        onChangeEnd={() => searchApi(term)}
        borderRadius={25}
      />

*/
