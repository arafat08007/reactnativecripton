import React, { useEffect, useState, createFactory } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
// import { useForm, Controller } from 'react-hook-form';
//@ts-ignore
import Autocomplete from 'react-native-autocomplete-input';
import api from '~/api';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import produce from 'immer';
import { RootState } from '~/redux/store';
import Modal from '~/components/GeneralStoreResult';
import { appColors } from '~/theme';

interface ProductGroup {
  TypeCode: string;
  GroupName: string;
  GroupCode: string;
}

interface Product {
  Id: string;
  ProductName: string;
  UnitName: string;
  StockQty: string;
}

export default () => {
  const user = useSelector((state: RootState) => state.auth?.user);

  const [categories, setCategories] = useState<ProductGroup[]>([]);
  const [category, setCategory] = useState<ProductGroup | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  // const [productQuery, setProductQuery] = useState('');

  const [selectedValue, setSelectedValue] = useState("Department");

  const [lst, setLst] = useState<{ query: string; product?: Product, qty: string; jus: string }[]>([{
    query: '',
    product: undefined,
    qty: '1',
    jus: '',
  }]);
  // const [product, setProduct] = useState<Product | undefined>();
  // const [qty, setQty] = useState('1');
  // const [jus, setJus] = useState('');


  const [res, setRes] = useState('');
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/InvProductGroupList');
      const categories = data.filter((x: any) => x.TypeCode === '101') as ProductGroup[];
      setCategories(categories);
    })()
  }, [])
  async function fetchProducts(iFor: string) {
    const { data } = await api.get('/InvProductList', { params: { iFor } });
    setProducts(data);
  }
  return (<ScrollView style={styles.root}>
    {res !== '' && res !== 'pending' ? <Modal close={() => setRes('')} text={res} /> : null}
    <Text style={styles.heading}>General Store Requisition</Text>
    <Text style={styles.labeltext}>Product for:</Text>
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: '99%' }}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="Department" key="Department" value="Department" />
      <Picker.Item label="Personal" key="Personal" value="Personal" />
    </Picker>
    <Text style={styles.labeltext} >Product Category (input first two letter of the category):</Text>
    <View style={{ minHeight: 60 }}>
      <Autocomplete
        data={categoryQuery && categoryQuery !== category?.GroupName ? categories.filter(x => x.GroupName.toLocaleLowerCase().startsWith(categoryQuery.toLocaleLowerCase())) : []}
        defaultValue={categoryQuery}
        onChangeText={(text: string) => setCategoryQuery(text)}
        renderItem={({ item }: { item: ProductGroup }) => {
          return <TouchableOpacity key={item.GroupCode} onPress={() => {
            setCategory(item);
            setCategoryQuery(item.GroupName);
            fetchProducts(item.GroupCode)
          }}><Text>{item.GroupName}</Text></TouchableOpacity>
        }}
        keyExtractor={(item: ProductGroup) => item.GroupCode}
      />
    </View>
    {lst.map(({ query, product, qty, jus }, i) => (
      <React.Fragment key={i}>
        <Text style={styles.labeltext}>Product #{i + 1} (input first two letters of your item):</Text>
        <View style={{ minHeight: 60 }}>
          <Autocomplete
            data={query && query !== product?.ProductName
              ? products.filter(x => x.ProductName.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
              : []}
            defaultValue={query}
            onChangeText={(text: string) => {
              const nextLst = produce(lst, draftLst => {
                draftLst[i].query = text;
              });
              setLst(nextLst);
            }}
            renderItem={({ item }: { item: Product }) => {
              return <TouchableOpacity key={item.ProductName} onPress={() => {
                const nextLst = produce(lst, draftLst => {
                  draftLst[i].product = item;
                  draftLst[i].query = item.ProductName;
                });
                setLst(nextLst);
              }}><Text>{item.ProductName}</Text></TouchableOpacity>
            }}
            keyExtractor={(item: Product) => item.Id}
          />
        </View>
        <Text style={styles.labeltext}>Quantity:</Text>
        <Input
          placeholder="Quantity"
          keyboardType="numeric"
          defaultValue={qty}
          onChangeText={text => {
            const nextLst = produce(lst, draftLst => {
              draftLst[i].qty = text;
            });
            setLst(nextLst);
          }}
        />
        <Text style={styles.labeltext}>Justification:</Text>
        <Input placeholder="Justification" onChangeText={text => {
          const nextLst = produce(lst, draftLst => {
            draftLst[i].jus = text;
          });
          setLst(nextLst);
        }} />
        <Text style={styles.gap}></Text>
      </React.Fragment>
    ))}
    {/* <View style={{ minHeight: 60 }}>
      <Autocomplete
        data={productQuery && productQuery !== product?.ProductName ? products.filter(x => x.ProductName.toLocaleLowerCase().startsWith(productQuery.toLocaleLowerCase())) : []}
        defaultValue={productQuery}
        onChangeText={(text: string) => setProductQuery(text)}
        renderItem={({ item }: { item: Product }) => {
          return <TouchableOpacity key={item.ProductName} onPress={() => {
            setProduct(item);
            setProductQuery(item.ProductName);
          }}><Text>{item.ProductName}</Text></TouchableOpacity>
        }}
        keyExtractor={(item: Product) => item.Id}
      />
    </View>
    <Text style={styles.labeltext}>Quantity:</Text>
    <Input
      placeholder="Quantity"
      keyboardType="numeric"
      defaultValue={qty}
      onChangeText={text => setQty(text)}
    />
    <Text style={styles.labeltext}>Justification:</Text>
    <Input placeholder="Justification" onChangeText={text => setJus(text)} />
    <Text style={styles.gap}></Text> */}
    <Button style={{ marginEnd: 24, marginStart: 24, padding: 5 }}
      title="+ Add another product"
      onPress={async () => {
        setLst([...lst, {
          query: '',
          product: undefined,
          qty: '1',
          jus: '',
        }]);
      }}
    />
    <Button style={{ marginEnd: 24, marginStart: 24, padding: 5 }}
      disabled={!lst[0].jus || !lst[0].product || !lst[0].qty}
      loading={res === 'pending'}
      title="Send the requisition"
      onPress={async () => {
        setRes('pending');
        try {
          const { data } = await api.get('/SspSaveReqForm', {
            params: {
              EmpId: user?.EmpId,
              DocId: "2e1177bb-554d-44c9-86c5-08ed3d12e3aa",
              Content: lst.map(p => [p.jus, p.product?.Id, p.qty].join('_==_')).join('_===_'),
              Remarks: selectedValue,
              ReqForId: '',
            }
          });
          if (data.Success) setRes(data.ReqNum)
          else setRes('failed')
        } catch (e) {
          setRes('failed')
        }

      }}
    />
  </ScrollView>)
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  heading: {
    fontSize: 16,
    textAlign: 'center',
    color: appColors.primary,
  },
  gap: {
    margin: '5%',
  },
  labeltext: {
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '600'
  }

})