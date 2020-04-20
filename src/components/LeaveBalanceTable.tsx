import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

import {
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
//@ts-ignore
import { Table, Row } from 'react-native-table-component';
import { RootState } from '~/redux/store';

import { getStatusBarHeight } from 'react-native-status-bar-height';

const windowHeight = Dimensions.get('window').height;
const headerHeight =
  Platform.select({
    android: 0,
    default: 0,
  }) + getStatusBarHeight();
const touchAreaHeight = 25;
const timeBarHeight = 0;

const topOffset = headerHeight + timeBarHeight;

const height = windowHeight - topOffset;

export default () => {
  const balance = useSelector((state: RootState) => state.leave.balance);

  //Effect
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
            <View style={styles.tableroot}>
              <Row
                style={{ padding: 5 }}
                textStyle={{ textAlign: 'center' }}
                data={['Leave Type', 'Assigned', 'Enjoyed', 'Remains']}
              />
              {balance.map((row) => (
                <Row
                  style={{ padding: 5 }}
                  textStyle={{ textAlign: 'center' }}
                  key={row.LvID}
                  data={[
                    row.LvName,
                    row.LvAssigned,
                    row.LvEnjoyed,
                    row.LvBalance,
                  ]}
                />
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </>
  );
};

const width = Dimensions.get('window').width;
const cardWidth = width - 10;

const styles = StyleSheet.create({
  tableroot: {
    width: cardWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    margin: 3,
    padding: 5,
    elevation: 2,
    borderRadius: 5,
  },
});
