import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
//@ts-ignore
import { Table, Row, Rows } from 'react-native-table-component';

const BoldText: React.FC = ({ children }) => {
  return <Text style={styles.bold}>{children}</Text>;
};

export default ({ data, itemData }: { data: string[]; itemData: string[] }) => {
  const dataCols = 2;
  const dataRows = [];
  for (let i = 0; i < data.length / dataCols; i++) {
    dataRows.push(data.slice(i * dataCols, (i + 1) * dataCols));
  }
  const itemCols = 7;
  const itemRows = [];
  for (let i = 0; i < itemData.length / itemCols; i++) {
    itemRows.push(itemData.slice(i * itemCols, (i + 1) * itemCols));
  }
  return (
    <>
      <Table style={{ margin: 20 }}>
        {dataRows.map(row => (
          <Row
            key={row[0]}
            data={row}
            style={{ paddingVertical: 2 }}
            textStyle={{ fontSize: 10 }}
          />
        ))}
      </Table>
      <Table style={{ margin: 20 }}>
        <Row
          data={['Leave type', 'Enjoyed', 'Remaining', 'From Date', 'To Date']}
          style={{ paddingVertical: 2 }}
          textStyle={{ fontSize: 10 }}
        />
        {itemRows
          .filter(row => row[0] === 'Yes')
          .map(row => (
            <Row
              key={row[1]}
              data={row.slice(1, row.length - 1)}
              style={{ paddingVertical: 2 }}
              textStyle={{ fontSize: 10 }}
            />
          ))}
      </Table>
    </>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});
