import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Header, Icon, Text } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Geolocation from 'react-native-geolocation-service';

import theme from '~/theme';
import SSP from '~/screens/SSP';
import MIS from '~/screens/MIS';
import { RootState } from '~/redux/store';
import { getStatus, getSummary } from '~/redux/attendance';
import { getLocations } from '~/redux/approvals';
import { logout } from '~/redux/auth';
import { RootStackParamList } from '~/App';
import Summary from '~/components/Summary';
import AttendancePrompt from '~/components/AttendancePrompt';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: NavigationProp;
}

export type TabParamList = {
  SSP: undefined;
  MIS: undefined;
};
const Tab = createMaterialTopTabNavigator<TabParamList>();

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'whenInUse',
    });
  }

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
}

export default ({ navigation }: DashboardScreenProps) => {
  const status = useSelector(
    (state: RootState) => state.attendance.dailyStatus,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStatus());
    dispatch(getSummary());
    dispatch(getLocations());
    requestPermissions();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        placement="left"
        leftComponent={
          <Icon
            name="logout"
            type="antdesign"
            color="#fff"
            containerStyle={{ transform: [{ rotate: '180deg' }] }}
            onPress={() => {
              dispatch(logout());
              navigation.replace('Login');
            }}
          />
        }
        centerComponent={{ text: 'CRIPTON', style: { color: '#fff' } }}
        rightComponent={
          <Icon
            name="person"
            color="#fff"
            onPress={() => {
              navigation.navigate('Profile');
            }}
          />
        }
        containerStyle={{ borderBottomWidth: 0 }}
      />
      <View style={styles.timeBar}>
        <View>
          <Text style={styles.timeText}>In Time</Text>
          <Text style={styles.timeText}>{status.InTime}</Text>
        </View>
        <View>
          <Text style={styles.timeText}>Out Time</Text>
          <Text style={styles.timeText}>{status.OutTime}</Text>
        </View>
        <View>
          <Text style={styles.timeText}>Status</Text>
          <Text style={styles.timeText}>{status.Status}</Text>
        </View>
      </View>
      <Summary />
      <Tab.Navigator
        tabBarOptions={{
          style: { backgroundColor: theme.colors?.primary },
          activeTintColor: '#fff',
          inactiveTintColor: '#f3f7ff',
          indicatorStyle: { backgroundColor: '#bd2669' },
        }}>
        <Tab.Screen name="SSP" component={SSP} />
        <Tab.Screen name="MIS" component={MIS} />
      </Tab.Navigator>
      <AttendancePrompt />
    </View>
  );
};

const styles = StyleSheet.create({
  timeBar: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    color: 'white',
    height: 50,
  },
  timeText: {
    color: '#fff',
  },
});
