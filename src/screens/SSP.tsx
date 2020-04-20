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
import { setShowModal } from '~/redux/attendance';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import { RootStackParamList } from '~/App';
import { TabParamList } from '~/screens/Dashboard';

const width = Dimensions.get('window').width;

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

type SSPScreenParamList = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TabParamList, 'SSP'>,
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
          title="APPROVALS"
          iconSrc={require('~/assets/approval.png')}
          onPress={() => navigation.navigate('Approval')}
        />
        <Card
          title="MY REQUISITIONS"
          iconSrc={require('~/assets/myrequsition.png')}
        />
        <Card
          title="LEAVE REQUISITIONS"
          iconSrc={require('~/assets/leave.png')}
          onPress={() => navigation.navigate('Leave')}
        />
        <Card
          title="REQUISITIONS"
          iconSrc={require('~/assets/allapproval.png')}
          onPress={() => navigation.navigate('Requisitions')}
        />
      </View>
      {!(status.OutTime && status.InTime) && (
        <View style={styles.attendance}>
          <Text style={styles.attendanceText}>Attendance</Text>
          <TouchableOpacity
            onLongPress={() => dispatch(setShowModal(true))}
            style={styles.roundButton}>
            <Text style={{ color: 'white', textAlign: 'center' }}>
              {status.Status === 'Absent' ? 'IN' : 'OUT'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.attendanceText}>
            Long Press {status.Status === 'Absent' ? 'IN' : 'OUT'}
          </Text>
        </View>
      )}
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
