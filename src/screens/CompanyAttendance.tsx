import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from '~/App';
import {
  fetchAttendanceSummary,
  CompanySummary,
  fetchCompanySummary,
} from '~/redux/attendanceInfo';
import { RootState } from '~/redux/store';
import Spinner from '~/components/Spinner';
import NoData from '~/components/NoData';
import { appColors } from '~/theme';
import { ScrollView } from 'react-native-gesture-handler';

type AttendanceRouteProp = RouteProp<RootStackParamList, 'CompanyAttendance'>;
type Props = {
  route: AttendanceRouteProp;
};

export const AttendanceCard = ({
  Company,
  Absent,
  Present,
  Manpower,
  Leave,
}: CompanySummary) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 5,
        margin: 5,
        padding: 10,
      }}>
      <Text style={{ fontSize: 18 }}>{Company}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 5,
        }}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>{Manpower}</Text>
          <Text style={{ textAlign: 'center' }}>Total</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', color: appColors.green }}>
            {Present}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.green }}>
            Present
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', color: appColors.red }}>
            {Absent}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.red }}>
            Absent
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', color: appColors.lightBlue }}>
            {Leave}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.lightBlue }}>
            Leave
          </Text>
        </View>
      </View>
    </View>
  );
};

export const Header = ({ data }: { data: CompanySummary[] }) => {
  const { Manpower, Present, Absent, Leave } = data.reduce(
    (prev, cur) => {
      prev.Absent += Number(cur.Absent);
      prev.Leave += Number(cur.Leave);
      prev.Manpower += Number(cur.Manpower);
      prev.Present += Number(cur.Present);
      return prev;
    },
    {
      Manpower: 0,
      Present: 0,
      Absent: 0,
      Leave: 0,
    },
  );
  return (
    <View
      style={{
        borderRadius: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 5,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            elevation: 5,
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}>
          <Text style={{ textAlign: 'center' }}>{Manpower}</Text>
          <Text style={{ textAlign: 'center' }}>Total</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            elevation: 5,
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}>
          <Text style={{ textAlign: 'center', color: appColors.green }}>
            {Present}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.green }}>
            Present
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            elevation: 5,
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}>
          <Text style={{ textAlign: 'center', color: appColors.red }}>
            {Absent}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.red }}>
            Absent
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            elevation: 5,
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}>
          <Text style={{ textAlign: 'center', color: appColors.lightBlue }}>
            {Leave}
          </Text>
          <Text style={{ textAlign: 'center', color: appColors.lightBlue }}>
            Leave
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ({ route }: Props) => {
  const { id, date } = route.params;
  const companySummary = useSelector((state: RootState) =>
    state.attendanceInfo.summary.find(x => x.CompanyId === id),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanySummary({ id }));
  }, []);
  const status = companySummary?.status;
  const summary = companySummary?.depts;
  return (
    <View style={{ flex: 1 }}>
      <Button title={companySummary?.Company} />
      {status === 'pending' ? (
        <Spinner />
      ) : status === 'rejected' ? (
        <NoData reason="Failed connect to server" />
      ) : summary?.length === 0 ? (
        <NoData />
      ) : status === 'fulfilled' ? (
        <ScrollView>
          {summary?.map(x => (
            <AttendanceCard key={x.CompanyId} {...x} />
          ))}
        </ScrollView>
      ): null}
    </View>
  );
};
