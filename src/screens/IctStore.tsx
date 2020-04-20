import React, { useEffect, useState, createFactory } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Text, Input, Button,Icon } from 'react-native-elements';
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
  const [selectedValue, setSelectedValue] = useState("myself");
  return (<ScrollView style={styles.root}>
    {res !== '' && res !== 'pending' ? <Modal close={() => setRes('')} text={res} /> : null}
    <Text style={styles.heading}>ICT Store Requisition</Text>
    <Text style={styles.labeltext}>Product for:</Text>
    <Picker
     selectedValue={selectedValue}
     style={{ height: 50, width: '99%' }}
     onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="Myslef" key="myselft" value ="myselft" />
      <Picker.Item label="Other" key="other" value="other" />
    </Picker>
    <Text style={{display:'none'}} >Product Category (input first two letter of the category):</Text>
    <View style={{ minHeight: 60 , display:"none"}}>
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
    <Text style={styles.labeltext}>Product or item (input first two letter of the item):</Text>
    <View style={{ minHeight: 60, padding:5, }}>
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
            DocId: "1f4f85f5-9ad6-40af-a86d-27a70a985869",
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

<View style={styles.warnview}>
<Icon
            name="warning"
            color={'#FFF'}
            size={24}
        />
  <Text style={{textAlign:'center', color:'white', fontSize:12}}>This feature is currently</Text>
  <Text  style={{textAlign:'center', color:'white', fontSize:16}}>UNDER CONSTRUCTION</Text>

</View>

  </ScrollView>)
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  warnview:{
    margin:20,
    flex:2,
    padding:10,
    justifyContent:'space-around',
    alignContent:'center',
    alignItems:'center',
    backgroundColor:appColors.red,
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