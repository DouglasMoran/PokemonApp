import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
  },
  containerChild: {
    flex: 1,
    alignItems: 'center',
  },
  imagePhoto: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: 24,
  },
  textName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  textEmail: {
    textAlign: 'center',
  },
  buttonSignOut: {
    marginTop: 200,
  },
});
