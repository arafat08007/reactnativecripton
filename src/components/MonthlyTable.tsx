import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
//@ts-ignore
import { Table, Row } from 'react-native-table-component';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

export default () => {
  const summary = useSelector(
    (state: RootState) => state.attendance.monthlySummary,
  );
  return (
    <Table>
      <Row
        style={styles.header}
        textStyle={styles.headerText}
        data={['Date', 'In', 'Out', 'Status']}
      />
      {summary.map(({ Atndate, Intime, Outtime, Outdate, status, SL }) => {
        return (
          <Row
            key={SL}
            style={styles.row}
            data={[
              <Text style={styles.atndate}>{Atndate}</Text>,
              <Text style={styles.intime}>{Intime}</Text>,
              <Text style={styles.outtime}>
                {Outtime}
                {'\n'}
                <Text style={styles.outdate}>{Outdate}</Text>
              </Text>,
              <Text style={styles.status}>{status}</Text>,
            ]}></Row>
        );
      })}
    </Table>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: 'white', paddingVertical: 5 },
  headerText: { textAlign: 'center' },
  row: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#a4a4a4',
  },
  atndate: {
    marginLeft: 5,
    textAlign: 'center',
    color: '#6f6f6f',
  },
  intime: { textAlign: 'center', color: '#2d875d' },
  outtime: { textAlign: 'center', color: '#e1593b' },
  outdate: {
    fontSize: 9,
    textAlign: 'center',
    color: '#6f6f6f',
  },
  status: { textAlign: 'center', color: '#1390cc' },
});
