import {StyleSheet} from 'react-native';
import Colors from '@common/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    width: '80%',
    height: '20%',
    alignSelf: 'center',
    margin: 50,
  },
  textWelcome: {
    fontSize: 52,
    fontWeight: 'bold',
    color: Colors.WHITE_P,
    fontFamily: 'Montserrat-ExtraBold',
  },
  buttonGoogle: {
    width: 192,
    height: 48,
  },
  childrenCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
