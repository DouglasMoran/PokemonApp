import {Dimensions, Platform} from 'react-native';

//DESIGN
const WIDTH_DESIGN = 414;
const HEIGHT_DESIGN = 896;

export const {width, height} = Dimensions.get(
  Platform.OS === 'ios' ? 'screen' : 'window',
);

export const resize = (size, type = 'h') => {
  const currentSize =
    type === 'width' || type === 'w' ? WIDTH_DESIGN : HEIGHT_DESIGN;
  const deviceSize = type === 'width' || type === 'w' ? width : height;
  const percent = (size * 100) / currentSize;
  const percentJS = percent / 100;

  return deviceSize * percentJS;
};