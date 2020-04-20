import { Theme, colors } from 'react-native-elements';

export const appColors = {
  ...colors,
  primary: '#234a8f',
  lightBlue: '#1390cc',
  red: '#e1593b',
  green: '#2d875d',
};

const theme: Theme = {
  colors: appColors,

  Text: {
    style: {
      color: colors.grey1,
    },
  },
};

export default theme;
