import React from 'react';
//@ts-ignore
import { Table, Row, Rows } from 'react-native-table-component';

export default ({ data }: { data: string[] }) => {
  const cols = 3;
  const rows = [];
  for (let i = 0; i < data.length / cols; i++) {
    rows.push(data.slice(i * cols, (i + 1) * cols));
  }
  return (
    <Table
      style={{ margin: 2 }}
      borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
      <Row
        data={['Grant', 'Item Name', 'Justification']}
        style={{ padding: 2 }}
        textStyle={{ fontSize: 10 }}
      />
      <Rows style={{ padding: 2 }} textStyle={{ fontSize: 10 }} data={rows} />
    </Table>
  );
};
