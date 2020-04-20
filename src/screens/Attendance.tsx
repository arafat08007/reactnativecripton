import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Icon, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from '~/App';
import { fetchAttendanceSummary, CompanySummary } from '~/redux/attendanceInfo';
import { RootState } from '~/redux/store';
import Spinner from '~/components/Spinner';
import NoData from '~/components/NoData';
import { appColors } from '~/theme';
import { toString } from '~/helpers';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import DatePicker from '@react-native-community/datetimepicker';

type AttendanceNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Attendance'
>;
type Props = {
  navigation: AttendanceNavigationProp;
};

export const AttendanceCard = ({
  Company,
  Absent,
  Present,
  Manpower,
  Leave,
  onPress,
}: CompanySummary & { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
    </TouchableOpacity>
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

export default ({ navigation }: Props) => {
  const { status, summary } = useSelector(
    (state: RootState) => state.attendanceInfo,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAttendanceSummary(undefined));
  }, []);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      {showPicker && (
        <DatePicker
          value={date}
          onChange={(event, date) => {
            setShowPicker(Platform.OS === 'ios');
            date && setDate(date);
          }}
        />
      )}
      <View
        style={{
          justifyContent: 'space-evenly',
          backgroundColor: 'white',
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
        }}>
        <Text>Select date: </Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text>{toString(date)}</Text>
        </TouchableOpacity>
        <Button
          type="clear"
          title="SEARCH"
          onPress={() => dispatch(fetchAttendanceSummary(date))}
          icon={<Icon name="search" size={18} />}
        />
      </View>
      {status === 'pending' ? (
        <Spinner />
      ) : status === 'rejected' ? (
        <NoData reason="Failed connect to server" />
      ) : summary.length === 0 ? (
        <NoData />
      ) : (
        <ScrollView>
          <Header data={summary} />
          {summary.map(x => (
            <AttendanceCard
              onPress={() =>
                navigation.navigate('CompanyAttendance', {
                  id: x.CompanyId,
                  date,
                })
              }
              key={x.CompanyId}
              {...x}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
