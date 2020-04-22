import React, { useEffect, useState, createFactory } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Text, Input, Button ,Icon,ButtonGroup} from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
//@ts-ignore
import Autocomplete from 'react-native-autocomplete-input';
import api from '~/api';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import Modal from '~/components/GeneralStoreResult';
import { appColors } from '~/theme';
//storge
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';
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

  const[cont,setCount]=useState('1')

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/InvProductGroupList');
      const categories = data.filter((x: any) => x.TypeCode === '1') as ProductGroup[];
      setCategories(categories);
    })()
  }, []);

  fetchProducts('1');
  async function fetchProducts(iFor: string) {
    const { data } = await api.get('/InvProductList', { params: { iFor } });
    setProducts(data);
  };
  const [selectedValue, setSelectedValue] = useState("myself");

  const [lst, setLst] = useState<{ query: string; product?: Product, qty: string; jus: string }[]>([{
    query: '',
    product: undefined,
    qty: '1',
    jus: '',
  }]);

//btn group

const showSavedItemModal= ()=>{
  return (
    <Text>This is ok</Text>
  )
}

  return (<ScrollView style={styles.root}>
    {res !== '' && res !== 'pending' ? <Modal close={() => setRes('')} text={res} /> : null}
    <Text style={styles.heading}>ICT Service Requisition</Text>
    <Text style={styles.labeltext}>Service for:</Text>
    <Picker
     selectedValue={selectedValue}
     style={{ height: 50, width: '99%' }}
     onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="Myslef" key="myselft" value ="myselft" />
      <Picker.Item label="Other" key="other" value="other" />
    </Picker>
    


    <Text style={{display:"none"}} >Service Category (input first two letter of categories):</Text>
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

    {
    lst.map(({ query, product, qty, jus }, i) => 
    (
<React.Fragment key={i} >
<View style={styles.productArea}>
    <Text style={{fontSize:14, color:appColors.primary, padding:5,}} >#{i + 1}</Text>
    <Text style={styles.labeltext}>I need service for: (input first two letter of your service):</Text>
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
    <Text style={{display:"none"}}>Quantity:</Text>
    <TextInput style={{display:'none'}} placeholder="Quantity" keyboardType="numeric" defaultValue={qty} onChangeText={text => setQty(text)} />
    <Text style={styles.labeltext}>Justification:</Text>
    <Input placeholder="..." onChangeText={text => {
          const nextLst = produce(lst, draftLst => {
            draftLst[i].jus = text;
          });
          setLst(nextLst);
        }} />
    
    </View>
    <Text style={styles.gap}></Text>
    </React.Fragment>
    )
    )
    }


<View style={styles.saveandview} >

<Button style={{ marginEnd: 10, marginStart: 10, padding: 5, marginBottom:5,backgroundColor:'#008080', }}
      
      title="+Add another Service"
      onPress={async () => {
        setLst([...lst, {
          query: '',
          product: undefined,
          qty: '1',
          jus: '',
        }]);
      }}
    />



<Button style={{ marginEnd: 10, marginStart: 10, padding: 5 }}
      disabled={!lst[0].jus || !lst[0].product || !lst[0].qty}
      loading={res === 'pending'}
      title="Send the requisition"
      onPress={async () => {
        setRes('pending');
        try {
          const { data } = await api.get('/SspSaveReqForm', {
            params: {
              EmpId: user?.EmpId,
              DocId: "929bae95-0117-4e21-b939-1a3010dcaa8c",
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

    



</View>


  
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
    margin:'2%',
  },
  labeltext:{
    marginBottom:5,
    fontSize:12,
    fontWeight:'600'
  },


//--------------save and view button---------------------------



  saveandview:{
    flex:1,
    justifyContent:'center',
    
    padding:10,
  
    flexDirection:'row',

  },
  saveandviewText:{
    flex:1,
    justifyContent:'center',
    flexDirection:'column',
    marginBottom:5,
  },
  btnsave_view:{
    padding:3,
    alignContent:'center',
   
    margin:2,
    fontSize:10,
  },
  btn_icon_label:{
    padding:2,
    alignContent:'center',
   
    textAlign:'center',
    fontSize:10,
  },
  productArea:{
    padding:10,
    backgroundColor:'#F5F5F5',
    borderRadius:3,
    borderColor:'rgba(0,0,0,0.2)',

    shadowColor: "#306ae5",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    }

})