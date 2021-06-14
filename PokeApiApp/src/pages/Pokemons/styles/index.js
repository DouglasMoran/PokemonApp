import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerMainCard: {
    flex: 1, 
    margin: 8,
  },
  containerChildCard: {
    flex: 1, 
    flexDirection: 'row', 
    margin: 12
  },
  imagePokemon: {
    flex: 1
  },
  containerDataCard: {
    width: 175,
    height: 175,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textName: {fontSize: 28, fontWeight: 'bold'},
  textSpeciesName: {fontSize: 16},
  
});
