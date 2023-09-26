interface IStyling {
  color?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string | number;
  fontSize?: number;
}
interface IComponents {
  button: {
    primary: IStyling;
    secondary: IStyling;
    ternary: IStyling;
    disabled: IStyling;
  };
}
interface IPalette {
  white: string;
  linegrey: string;
  tundora: string;
  black: string;
  ash: string;
  eerieBlack: string;
  purple: string;
  gainsboro: string;
  skobeloff: string;
  blackestBlack: string;
  lightPurple: string;
  board:string;
  border:string;
}
export interface IFonts {
  primary: string;
  secondary: string;
  arcade: string;
}

const colors: IPalette = {
  white: '#fff',
  linegrey: '#E8E8E8',
  tundora: '#4E4E4E',
  black: '#202020',
  ash: '#484848',
  eerieBlack: '#1d1d1d',
  purple: '#1E044D',
  gainsboro: '#D8DBE2',
  skobeloff: '#006C67',
  blackestBlack: '#000000',
  lightPurple: '#AC92EC',
  //board:'#c891c9',
  board:'#c891c9',
  border:'#2dcbd6',
};
export interface IDefaultTheme {
  palette: IPalette;
  components: IComponents;
  fonts: IFonts;
}

export const theme: IDefaultTheme = {
  palette: colors,

  fonts: {
    primary: 'open-semi-bold',
    secondary: 'lato-bold',
    arcade: 'arcade-n',
  },

  components: {
    button: {
      primary: {
        color: colors.white,
        background: colors.purple,
        borderWidth: 0,
        borderColor: 'transparent',
        fontSize: 14,
      },
      secondary: {
        color: colors.white,
        background: 'transparent',
        borderWidth: '2px',
        borderColor: colors.white,
        fontSize: 18,
      },
      ternary: {
        color: colors.purple,
        background: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        fontSize: 18,
      },
      disabled: {
        color: colors.ash,
        background: 'transparent',
        borderWidth: '1px',
        borderColor: colors.ash,
        fontSize: 18,
      },
    },
  },
};
