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
    <Text style={styles.labeltext}>I need service for: (input first two letter of your service):</Text>
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
    <Text style={{display:"none"}}>Quantity:</Text>
    <TextInput style={{display:'none'}} placeholder="Quantity" keyboardType="numeric" defaultValue={qty} onChangeText={text => setQty(text)} />
    <Text style={styles.labeltext}>Justification:</Text>
    <Input placeholder="Justification" onChangeText={text => setJus(text)} />
    <Text style={styles.gap}></Text>

<View style={styles.saveandview} >
<Button
    onPress={async () => {
      try {
        var i:number = 1;
        setCount(''+i+1);
        await AsyncStorage.setItem('savedContent', [jus, product?.Id, qty].join('_==_'),);
        console.info( await AsyncStorage.getItem('savedContent') || 'none');
      } catch (error) {
        // Error retrieving data
        console.error(error.message);
      }
    }}
   style={styles.btnsave_view}
    
    accessibilityLabel="Save and add more"
    type="clear"
    icon={
      <Icon
        color={appColors.primary}
        raised={true}
        name="save"
        size={26}
      />
    }
    
  />

<Button
   // onPress={() => setShowApproveModal(true)}

   onPress={async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
     const result= await AsyncStorage.multiGet(keys || 'none');

      
    showSavedItemModal();

    } catch (error) {
      // Error retrieving data
      console.error(error.message);
    }
  }}
   style={styles.btnsave_view}

   accessibilityLabel="View the saved items"
    type="clear"
    icon={
      <Icon
        color={appColors.primary}
        raised={true}
        
        name="explore"
        size={26}
      />
    }
  />
</View>

<View style={styles.saveandviewText} >
<Text style={styles.btn_icon_label}>Press save button to Save and add more items, </Text>
<Text style={styles.btn_icon_label}>Press explore button to view saved items</Text>


</View>
    <Button style={{marginEnd:24,marginStart:24,padding:5}} 
    disabled={!jus || !product || !qty} loading={res === 'pending'} title="Send the requisition" 
    onPress={async () => {
      setRes('pending');
      try {
        const { data } = await api.get('/SspSaveReqForm', {
          params: {
            EmpId: user?.EmpId,
            DocId: "929bae95-0117-4e21-b939-1a3010dcaa8c",
            Content: [jus, product?.Id, qty].join('_==_'),
            Remarks: '',
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
  }

})