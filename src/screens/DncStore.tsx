import React, { useEffect, useState, createFactory } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
//@ts-ignore
import Autocomplete from 'react-native-autocomplete-input';
import api from '~/api';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>();
  const [category, setCategory] = useState<ProductGroup | undefined>();
  const [categoryQuery, setCategoryQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [qty, setQty] = useState('1');
  const [jus, setJus] = useState('');
  const [selectedValue, setSelectedValue] = useState("Department");

  const [res, setRes] = useState('');
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/InvProductGroupList');
      const categories = data.filter((x: any) => x.UnitName === 'DnC') as ProductGroup[];
      setCategories(categories);
    })()
  }, [])
  async function fetchProducts(iFor: string) {
    const { data } = await api.get('/InvProductList', { params: { iFor } });
    setProducts(data);
  }
  return (<ScrollView style={styles.root}>
    {res !== '' && res !== 'pending' ? <Modal close={() => setRes('')} text={res} /> : null}
    <Text style={styles.heading}>DnC Store Requisition</Text>
    <Text style={styles.labeltext}>Product for:</Text>
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: '99%' }}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="Department" key="Department" value="Department" />
      <Picker.Item label="Personal" key ="Personal"  value="Personal" />
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
    <Text style={styles.labeltext}>Product (input first two letters of your item):</Text>
    <View style={{ minHeight: 60 }}>
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
    <Input placeholder="Quantity" keyboardType="numeric" defaultValue={qty} onChangeText={text => setQty(text)} />
    <Text style={styles.labeltext}>Justification:</Text>
    <Input placeholder="Justification" onChangeText={text => setJus(text)} />
    <Text style={styles.gap}></Text>
    <Button style={{marginEnd:24,marginStart:24,padding:5}} 
    disabled={!jus || !product || !qty} loading={res === 'pending'} title="Send the requisition" 
    onPress={async () => {
      setRes('pending');
      try {
        const { data } = await api.get('/SspSaveReqForm', {
          params: {
            EmpId: user?.EmpId,
            DocId: "aaca9a95-400f-4b48-bbfd-b63e71a7fa8b",
            Content: [jus, product?.Id, qty].join('_==_'),
            Remarks: selectedValue,
            ReqForId: '',
          }
        });
        if (data.Success) setRes(data.ReqNum)
        else setRes('failed')
      } catch (e) {
        setRes('failed')
      }

    }} />
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
    color:appColors.primary,
  },
  gap:{
    margin:'5%',
  },
  labeltext:{
    marginBottom:5,
    fontSize:12,
    fontWeight:'600'
  }

})