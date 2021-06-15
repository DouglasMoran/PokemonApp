import {StyleSheet} from 'react-native';
import Colors from '@common/Colors';

export default StyleSheet.create({
  containerMain: {flex: 1, margin: 8},
  activityIndicator: {width: 32, height: 32},
  containerButtonsActions: {
    width: 120,
    height: 50,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textDescription: {fontFamily: 'CourierPrime-Regular', marginTop: 8},
  textType: {fontSize: 16, fontFamily: 'CourierPrime-Bold',  marginTop: 4},
  textName: {fontSize: 21, fontFamily: 'Montserrat-ExtraBold',},
  textPokemonsL: {fontFamily: 'CourierPrime-Bold', width: 120},
  containerData: {flex: 1,},
  containerButtonsText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerChildCard: {width: '95%', height: 200, flexDirection: 'column', padding: 8,},
  buttonGetStarter: {
    width: 150,
    height: 42,
    backgroundColor: Colors.BLUE_A200,
    alignItems: 'center',
    marginTop: 24,
  },
  fontButtonStarter: {fontFamily: 'Montserrat-ExtraBold'},
  textQuestions: {
    fontFamily: 'CourierPrime-Bold',
    fontSize: 21,
    marginTop: 16,
  },
  textMessage: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 18,
    marginTop: 32,
  },
  imageTeam: {width: '100%', height: 300, marginEnd: 24, marginStart: 24},
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
