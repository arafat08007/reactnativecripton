import React, { useState, useEffect } from 'react';
import { Animated, Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const windowHeight = Dimensions.get('window').height;
const headerHeight =
  Platform.select({
    android: 56,
    default: 44,
  }) + getStatusBarHeight();
const touchAreaHeight = 25;
const timeBarHeight = 50;

const topOffset = headerHeight + touchAreaHeight + timeBarHeight;

const height = windowHeight - topOffset;

import MontyTable from './MonthlyTable';
import { Icon } from 'react-native-elements';
import {
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native-gesture-handler';

export default () => {
  const [showTable, setShowTable] = useState(false);
  const [zIndex, setZIndex] = useState(-10);
  const [scale] = useState(new Animated.Value(0.0001));
  const [fade] = useState(new Animated.Value(1));
  function toggleView() {
    setShowTable(!showTable);
    !showTable && setZIndex(10);
    Animated.timing(scale, {
      toValue: showTable ? 0.0001 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      showTable && setZIndex(-10);
    });
  }
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <>
      <TouchableWithoutFeedback
        onPress={toggleView}
        style={{
          backgroundColor: '#333',
          height: touchAreaHeight,
        }}>
        <Animated.View
          style={{
            opacity: showTable ? 1 : fade,
            transform: [
              {
                rotate: scale.interpolate({
                  inputRange: [0.0001, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}>
          <Icon color="white" name="keyboard-arrow-down" />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          zIndex,
          height,
          top: topOffset,
          transform: [
            {
              translateY: scale.interpolate({
                inputRange: [0.0001, 1],
                outputRange: [-height / 2, 0],
              }),
            },
          ],
        }}>
        <Animated.View
          style={{
            height,
            transform: [{ scaleY: scale }],
          }}>
          <ScrollView>
            <MontyTable />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </>
  );
};
