import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';

const Card = ({
  title,
  iconSrc,
  onPress,
}: {
  title: string;
  iconSrc: any;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardRoot}>
      <Image source={iconSrc} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const width = Dimensions.get('window').width;
const cardWidth = width / 2 - 10;

const styles = StyleSheet.create({
  cardRoot: {
    width: cardWidth,
    height: cardWidth * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    elevation: 2,
    borderRadius: 5,
  },
});

export default Card;
