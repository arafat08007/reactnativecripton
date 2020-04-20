import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';

import theme from '~/theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import { RootStackParamList } from '~/App';
import { TabParamList } from '~/screens/Dashboard';
import Card from '~/components/Card';

const width = Dimensions.get('window').width;

type SSPScreenParamList = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TabParamList, 'MIS'>,
  StackNavigationProp<RootStackParamList, 'Dashboard'>
>;
type Props = {
  navigation: SSPScreenParamList;
};

export default ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const status = useSelector(
    (state: RootState) => state.attendance.dailyStatus,
  );
  // console.log(status);
  return (
    <ScrollView style={styles.root}>
      <View style={styles.cards}>
        <Card
          title="ATTENDANCE"
          iconSrc={require('~/assets/attendance.png')}
          onPress={() => navigation.navigate('Attendance')}
        />
      </View>
    </ScrollView>
  );
};

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
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cards: {
    // flexShrink: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  attendance: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  attendanceText: {
    color: 'grey',
    textAlign: 'center',
    marginVertical: 10,
  },
  roundButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors?.primary,
  },
});
