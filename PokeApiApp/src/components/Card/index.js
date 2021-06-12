import React from 'react';
import {View, Dimensions} from 'react-native';
import Colors from '@common/Colors';

const {width, height} = Dimensions.get('screen');

const Card = props => {
  return (
    <View
      style={{
        width: props.StyleCustom.width || '100%',
        height: props.StyleCustom.height || '40%',
        backgroundColor: props.StyleCustom.backgroundColor || Colors.GREY_300,
        borderTopEndRadius: props.StyleCustom.borderTopEndRadius || 8,
        borderTopStartRadius: props.StyleCustom.borderTopStartRadius || 8,
        borderBottomEndRadius: props.StyleCustom.borderBottomEndRadius || 0,
        borderBottomStartRadius: props.StyleCustom.borderBottomStartRadius || 0,
        alignItems: props.StyleCustom.alignItems || 'center',
        justifyContent: props.StyleCustom.justifyContent || 'center',
        marginEnd: props.StyleCustom.marginEnd || 0,
        marginStart: props.StyleCustom.marginStart || 0,
        marginTop: props.StyleCustom.marginTop || 0,
        marginBottom: props.StyleCustom.marginBottom || 0,
        alignSelf: props.StyleCustom.alignSelf || 'center',
      }}>
      {props.children}
    </View>
  );
};

export default Card;
