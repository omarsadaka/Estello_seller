import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions,Alert, AsyncStorage ,StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import { DrawerActions } from 'react-navigation-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import NavigationServices from './../../NavigationServices';
import FlipToggle from 'react-native-flip-toggle-button'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import {
   LineChart,
   BarChart,
   PieChart,
   ProgressChart,
   ContributionGraph,
   StackedBarChart
 } from "react-native-chart-kit";


const listArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]
const list = [
   { id: 1 , name: 'Orders' , image: require('./../../../image/house.png'),image2: require('./../../../image/y_house.png') },
   { id: 2 ,name: 'Products' , image: require('./../../../image/product.png'),image2: require('./../../../image/y_product.png')},
   { id: 3 ,name: 'Store' , image: require('./../../../image/store.png'),image2: require('./../../../image/y_store.png') }, 
   { id: 4 ,name: 'Profile', image: require('./../../../image/prof.png'),image2: require('./../../../image/y_prof.png') }
]

const listFilter = [{ id: 4 , name:'Jeans' }, { id: 5 , name:'Pants' }, { id: 6 , name:'Shirts'},
 { id: 7 , name:'T-Shirts' }, { id: 8 , name:'Shoes'}, { id: 9 , name:'SportsWear'}]


 const chartConfig = {
   backgroundGradientFrom: "#1E2923",
   backgroundGradientFromOpacity: 0,
   backgroundGradientTo: "#08130D",
   backgroundGradientToOpacity: 0.5,
   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   strokeWidth: 2, // optional, default 3
   barPercentage: 0.5,
   useShadowColorFromDataset: false // optional
 };
 

import { connect } from 'react-redux' // redux
import { SetLoading , SetLanguage , getSellerProduct , getStatistics , getProfile , getCustomization} from './../../Actions' //redux


class Home extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Processing:false,
         scrollX: new Animated.Value(0),
         id: 1,
         products:[],
         filterProducts:[],
         flag_view:1,
         flag_filter:1,
         radioSelected: null,
         radioSelected2: null,
         flag_sort:1,
         radioSelected2: null,
         productName:'',
         data: [
            {
              population: 70,
              color: "#FFCF01",
            },
            {
              population: 30,
              color: "#383B43",
            },
          ],
          cat:'',
          sub_cat:'',
          sort:'',
          flag_search: 1
      };
   }

    UNSAFE_componentWillMount(){
       this.props.getStatistics(this.props.User.token)
       this.props.getProfile(this.props.User.token)
       console.log(this.props.User.token)
      //  this.state.data[0].population = this.props.Statistics.male_percentage
      //  this.state.data[1].population = this.props.Statistics.female_percentage
    }


    componentWillReceiveProps(nextProps) {
      if (nextProps.Message != null) {
         alert(nextProps.Message)
    }
  }

  signOut =async() =>{
   Alert.alert(
     this.props.Language == "AR"?'أستيلو':'Estilo' ,
     this.props.Language == "AR"?'هل أنت متأكد من تسجيل الخروج':'Are you sure want to logout',
     [
       {text: this.props.Language == "AR"?'ألغاء':'Cancel' ,
       onPress: () => this.dismiss, style: 'cancel'},
       {text:this.props.Language == "AR"?'نـعم':'Yes' ,  onPress: () => {
         try{
         AsyncStorage.removeItem('User');
         NavigationServices.reset('Login')
         }catch(e){
            alert(e)
         }
        }
      },
     ],
     { cancelable: true }
   )
    return true;
    }

    changeLanguage = async (lang) => {
      this.props.SetLoading(true)
      try {
          await AsyncStorage.setItem('Lang', lang).then((value) => {
              AsyncStorage.getItem('Lang')
                  .then((val) => {
                     this.props.SetLoading(false)
                      this.props.SetLanguage(val)
                     //  this.props.navigation.dispatch(StackActions.reset({
                     //      index: 0,
                     //      actions: [
                     //          NavigationActions.navigate({ routeName: 'Login' })
                     //      ],
                     //  }))
                  })
          })

      } catch (error) {
         this.props.SetLoading(false)
          alert("error")
      }
  };
 
   getSellerProduct=(Token )=>{
          NetInfo.fetch().then(state =>{
              if (state.isConnected){
          try {
             this.props.SetLoading(true)
              axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_products/', {
                  headers: {
                      'Authorization': 'Token '+Token,
                    }
              }).then((response)=> {
               this.props.SetLoading(false)
                  var Data = response.data.list
                  const products = []
                  for (let index = 0; index < Data.length; index++) {
                      var obj = {
                          id: Data[index].id,
                          name: Data[index].name,
                          price: Data[index].price,
                          image: Data[index].image,
                          viewed: Data[index].viewed
                      }
                   
                      products.push(obj)
                  }
                 this.setState({products})
                 this.setState({filterProducts:products})
              }).catch((error)=> {
               this.props.SetLoading(false)
                  alert(error)
                  if (error.response.data.error) {
                      alert( error.response.data.error)
                  } else {
                      alert( "Something went wrong" )
                  }
              }).finally(function () {
                  // always executed
              });
          } catch (error) {
            this.props.SetLoading(false)
            alert( "Something went wrong" )
          }
      } else {
          alert('No internet connection')
         }
       });
  }
  
  search(word){
   const filterArray=[]
   if(word!=''){
    this.state.products.forEach(element => {
      if(element.name.includes(word)){
         filterArray.push(element)
          this.setState({products: filterArray})
      }
   });
   }else{
    this.setState({products: this.state.filterProducts})
   }
    
 }

  getProductFilter = () => {
   const { navigation } = this.props;
   const id = navigation.getParam('ID', 'NO-ID');
   const { cat , sub_cat }= this.state
   if(cat){
      if(sub_cat){
         NetInfo.fetch().then(state =>{
            if (state.isConnected){
          try {
              this.props.SetLoading(true)
              axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_seller_profile/1/',{
               headers: {
                  'Authorization': 'Token '+this.props.User.token
                },
                params:{
                  name__startswith: sub_cat ,
                  sex: cat
                }
              })
              .then((response)=> {
               this.props.SetLoading(false)
                  const Data = response.data.products;
                  const store = response.data.store
                   const products = []
                   for (let index = 0; index < Data.length; index++) {
                  var obj = {
                      id: Data[index].id,
                      name: Data[index].name,
                      price: Data[index].price,
                      image: Data[index].image,
                      favourite: Data[index].favourite
                  }
                  products.push(obj)
              }
                this.setState({products})
                if(products.length==0){
                   alert('No Filter Data')
                }
                if(this.state.flag_filter==1){
                  this.setState({flag_filter:2})
                 }else{
                  this.setState({flag_filter:1})
                 }
              }).catch((error)=> {
               this.props.SetLoading(false)
               if(error.response.data.detail){
                  alert(error.response.data.detail)
               }else{
                  alert(error)
               }
              }).finally(function () {
                  // always executed
              });
          } catch (error) {
            this.props.SetLoading(false)
              alert("Something went wrong")
          }
         } else {
            if(this.props.Language=='AR'){
               alert('لا يوجد أتصال بالانترنت')
             }else{
               alert('No internet connection')
             }
           }
         });
      }else{
         alert('Enter SubCategory First')
      }

   }else{
      alert('Enter Category First')
   }
}

getProductSort = () => {
   const { navigation } = this.props;
   const id = navigation.getParam('ID', 'NO-ID');
   const { sort}= this.state
   if(sort){
         NetInfo.fetch().then(state =>{
            if (state.isConnected){
          try {
              this.props.SetLoading(true)
              axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_seller_profile/1',{
               headers: {
                  'Authorization': 'Token '+this.props.User.token
                },
                params:{
                  order_by: sort ,
                }
              })
              .then((response)=> {
               this.props.SetLoading(false)
                  const Data = response.data.products;
                  const store = response.data.store
                   this.setState({store})
                   const products = []
                   for (let index = 0; index < Data.length; index++) {
                  var obj = {
                      id: Data[index].id,
                      name: Data[index].name,
                      price: Data[index].price,
                      image: Data[index].image,
                      favourite: Data[index].favourite
                  }
                  products.push(obj)
              }
                this.setState({products})
                if(products.length==0){
                   alert('No Filter Data')
                }
                if(this.state.flag_sort==1){
                  this.setState({flag_sort:2})
                 }else{
                  this.setState({flag_sort:1})
                 }
              }).catch((error)=> {
               this.props.SetLoading(false)
               if(error.response.data.detail){
                  alert(error.response.data.detail)
               }else{
                  alert(error)
               }
              }).finally(function () {
                  // always executed
              });
          } catch (error) {
            this.props.SetLoading(false)
              alert("Something went wrong")
          }
         } else {
            if(this.props.Language=='AR'){
               alert('لا يوجد أتصال بالانترنت')
             }else{
               alert('No internet connection')
             }
           }
         });
     
   }else{
      alert('Enter your Sort First')
   }
}

renderFilter(item){
   return(
      <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'80%',alignItems:'center',marginBottom:'3%'}]}>
       <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{item.name}</Text>
       <TouchableOpacity
        style={{width:20,height:20,borderRadius:20/2,borderColor:'#fff',borderWidth:1,margin:3,justifyContent:'center',alignItems:'center'}}
        onPress={()=>{
          this.setState({radioSelected2:item.id})
          this.setState({sub_cat: item.name.toLowerCase()})
        }}>
         {this.state.radioSelected2 === item.id?
         <View  style={{width:15 ,height:15 ,borderRadius:15/2,backgroundColor:'#FFCF01'}}></View>
        :
        <View style={{display:'none'}}></View>
        }
       </TouchableOpacity>
      </View>
   )
}

  renderHeader() {
   return (
      <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
        <View style={{justifyContent:'center',margin:5,}}>
         <TouchableOpacity
         onPress={()=> {
            if(this.state.flag_search==1){
               this.setState({flag_search:2})
            }else{
               this.setState({flag_search:1})
            }
            
            }}>
        <Icon name="search" size={27} color="#fff" style={{}} />
        </TouchableOpacity>
        </View>
        {this.state.flag_search==1?
            <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'الرئيسية':'Home'}</Text>
        :
        <View style={[styles.searchSection,{ height:40}]}>
        <TextInput
            style={styles.input}
            placeholder="Search filter"
            placeholderTextColor='#000'
            onChangeText={(searchString) => {
               this.search(searchString)
            }}
            underlineColorAndroid="transparent"
        />
        </View>
        }

        <TouchableOpacity >
           <View style={{width:35,}}>
          
           </View>
        </TouchableOpacity>
      </View>
   )
}

renderList(item) {
   const {id} = this.state
   return (
      <TouchableOpacity 
      onPress={() => { this.setState({id: item.id})
        if(item.id ==1){
           this.setState({flag_view:1})
           this.props.getStatistics(this.props.User.token)
         //   this.state.data[0].population = this.props.Statistics.male_percentage
         //   this.state.data[1].population = this.props.Statistics.female_percentage
        }else if(item.id ==2){
         this.setState({flag_view:2})
         this.getSellerProduct(this.props.User.token)
        }else if(item.id ==3){
         this.setState({flag_view:3})
         this.getSellerProduct(this.props.User.token)
         this.props.getCustomization(this.props.User.token)
        }else{
         this.setState({flag_view:4})
        }
      }} 
      style={{justifyContent:'center',alignItems:'center',marginHorizontal:15}}>
          <View style={[styles.shadow, { width:70,height:70,borderRadius:70/2,backgroundColor:item.id == id?'#2D2D2D':'#fff',justifyContent: 'center', alignItems: 'center',}]} >
            <Image source={ item.id== id ?item.image2:item.image} style={{ width:'50%',height:'50%',}} resizeMode='contain' /> 
          </View>
         <Text style={{ color: '#2D2D2D', fontSize:14,fontFamily:'nexa_light',marginTop:5 }}>{item.name}</Text>
       </TouchableOpacity>
   )
} 

renderRadio(clicked){
   return(
    <TouchableOpacity
    style={{width:20,height:20,borderRadius:20/2,borderColor:'#fff',borderWidth:1,margin:3,justifyContent:'center',alignItems:'center'}}
    onPress={()=>{
       this.setState({radioSelected:clicked})
       if(clicked==1){
         this.setState({cat: 'men'})
      }else if(clicked==2){
        this.setState({cat: 'women'})
      }else{
        this.setState({cat: 'kids'})
      }
    }}>
      {this.state.radioSelected === clicked?
      <View  style={{width:15 ,height:15 ,borderRadius:15/2,backgroundColor:'#FFCF01'}}></View>
      :
      <View style={{display:'none'}}></View>
      }
    </TouchableOpacity>
   )
 }


renderItem(index ,item) {
   return (
      <TouchableOpacity activeOpacity={1}
      onPress={() => this.props.navigation.navigate('ProductDetail',{ID: item.id})}
      key={index.toString()} style={{flex:1,alignItems:'center',justifyContent: 'center',margin:4 }} >
            <View style={[styles.shadow,{width:'100%',height:height*0.4,alignItems:'center', justifyContent:'center',borderRadius:5 ,backgroundColor:'#fff'}]}>
               <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+ item.image}} resizeMode='cover'
               style={{ width: '100%', flex:1,}} />
                
             <View style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{width:35,height:35,borderRadius:35/2,
                 backgroundColor:'#E8DEDE',alignItems:'center',justifyContent:'center',position:'absolute',top:10}]}>
               {item.viewed?
                <Icon name="eye" size={30} color="#FFCF01"/>
               :
               <Icon name="eye" size={30} color="#212121"/>
               }
              
             </View>

               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:15,color:'#707070',fontFamily:'nexa_bold',marginTop:7}]}>
                {item.name}</Text>
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:20,marginBottom:10}]}>
                {item.price}</Text>

            </View>
      </TouchableOpacity>
   )
} 
 
renderItem2(index) {
   return (
      <TouchableOpacity activeOpacity={1}
      onPress={() => this.props.navigation.navigate('ProductDetail')}
      key={index.toString()} style={{flex:1,alignItems:'center',justifyContent: 'center',margin:4 }} >
            <View style={[styles.shadow,{width:'100%',height:height*0.4,alignItems:'center', justifyContent:'center',borderRadius:5 ,backgroundColor:'#fff'}]}>
               <Image source={require('./../../../image/favorite.png')} resizeMode='cover'
               style={{ width: '100%', flex:1,}} />
                
             <View style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{width:40,height:40,borderRadius:40/2,
                 backgroundColor:'#E8DEDE',alignItems:'center',justifyContent:'center',position:'absolute',top:10}]}>
               {this.state.flag_fav==1?
                <Icon name="heart" size={25} color="#FFCF01"
                onPress={()=>{
                   if(this.state.flag_fav==1){
                       this.setState({flag_fav:2})
                   }else{
                       this.setState({flag_fav:1})
                   }
                 }}/>
               :
               <Icon name="heart" size={25} color="#707070"
               onPress={()=>{
                 if(this.state.flag_fav==1){
                     this.setState({flag_fav:2})
                 }else{
                     this.setState({flag_fav:1})
                 }
               }}/>
               }
              
             </View>

               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:15,color:'#707070',fontFamily:'nexa_bold',marginTop:7}]}>
                Fancy Dress for Women</Text>
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:20,marginBottom:10}]}>
                400 KWD</Text>

            </View>
      </TouchableOpacity>
   )
}

renderItemStore(index , item) {
   return (
            <View style={[styles.shadow,{width:180,alignItems:'center', justifyContent:'center',borderRadius:8 ,backgroundColor:'#fff',margin:5}]}>
               <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}} resizeMode='cover'
                style={{ width: '90%', height:100,marginTop:15}} />
                
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#6E7177',fontFamily:'nexa_bold',marginTop:5}]}>
                {item.name}</Text>
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#6E7177',fontFamily:'nexa_light',marginTop:2,marginBottom:5}]}>
                {item.describtion}</Text>

            </View>
   )
}
renderOneViewItem(item){
   return(
      <TouchableOpacity 
      style={[styles.row, { justifyContent: 'center', marginTop: 30, }]} >
     <View style={[styles.flex, styles.row, { width: width - (10 * 2), height: height/4, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFF' }]}>
     <ImageBackground
      resizeMode ="cover"
      source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}}
      style={{  width: width, height: '100%', alignItems: 'center', borderRadius:15}} />
     <LinearGradient colors={['#1E1E1E','#35353569']} style={styles.linearGradient}/>
     <View style={[this.props.Language=='AR'?styles.posRight:styles.posLeft,{width:'90%',alignItems:'center',position: 'absolute',bottom:'15%',}]}>
     <Text style={{width:'100%',fontSize:20,color:'#000',fontFamily:'nexa_bold'}}>
     {item.name}</Text>
     <Text style={{width:'100%',fontSize:13,color:'#000',fontFamily:'nexa_light'}}>
     {item.describtion}</Text>
     </View>
    
     </View>

     <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,{width:'90%',position:'absolute'}]}>
      <TouchableOpacity
     //  onPress={()=> this.props.navigation.navigate('AddProduct')}
      style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
       <Icon name="chevron-down" size={17} color="#212121" style={{}} />
      </TouchableOpacity>
      <TouchableOpacity
     //  onPress={()=> this.props.navigation.navigate('AddProduct')}
      style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
       <Icon name="chevron-up" size={17} color="#212121" style={{}} />
      </TouchableOpacity>
      <TouchableOpacity
     //  onPress={()=> this.props.navigation.navigate('AddProduct')}
      style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
       <Icon name="trash-o" size={20} color="#212121" style={{}} />
      </TouchableOpacity>
      </View>
   </TouchableOpacity>
   )
}



renderViewItem(index,item) {
   return (
      <TouchableOpacity activeOpacity={1}
      // onPress={() => this.props.navigation.navigate('ProjectInfo')} 
       key={index.toString()} style={[ { justifyContent: 'center',margin:5 }]} >
            <View style={[styles.shadow,this.props.Language=='AR'?styles.rowReversed:styles.row,{ width: '93%', height: height*0.12,alignItems:'center', borderRadius:10 ,backgroundColor:'#fff'}]}>
               <Image source={{uri: "http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com"+item.image}}
               style={{ width: 100, height: '93%', borderRadius:5,margin:5}} />
               <View style={{flex:1,height:'99%',justifyContent:'center'}}>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:13,color:'#212121',fontFamily:'nexa_bold',marginHorizontal:5}]}>
                {item.name}</Text>
                {this.props.Language=='AR'?
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',marginHorizontal:5,marginTop:'3%'}]}>
                 السعــر : {item.price}</Text>
                :
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',marginHorizontal:5,marginTop:'3%'}]}>
                 Price : {item.price}</Text>
                }
               
                {/* <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',marginHorizontal:5}]}>
                Quantity : 4</Text> */}
               
               </View>

               <View style={{width:100,height:'99%',alignItems:'center',justifyContent:'center'}}>
               <View style={{width:35,height:35,borderRadius:35/2,
                 backgroundColor:'#E8DEDE',alignItems:'center',justifyContent:'center'}}>
               {item.viewed?
                <Icon name="eye" size={30} color="#FFCF01"/>
               :
               <Icon name="eye" size={30} color="#212121"/>
               }
              
             </View>
               </View>
               
            </View>
      </TouchableOpacity>
   )
}

  renderTab1() {

   const data = [
      {
        population: 70,
        color: "#FFCF01",
      },
      {
        population: 30,
        color: "#383B43",
      },
    ];
   return (
       <View style={{  width:width,justifyContent:'center',alignItems:'center' }}>
         <Text style={{ color: '#707070', fontSize:18,textAlign:'center',marginTop:10,fontFamily:'nexa_bold',}}>{this.props.SellerData.store}</Text>
         <View style={{width:'90%',height:1,backgroundColor:'#70707025',marginTop:10}}></View>
         <Text style={{ color: '#212121', fontSize:15,textAlign:'center',marginTop:15,fontFamily:'nexa_bold',}}>
            {this.props.Language=='AR'?'ماذا حدث اليوم':'What Happened Today'}</Text>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
          <TouchableOpacity
          onPress={()=>  this.props.navigation.navigate('PendingOrders')}
          style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#FFCF01'}}>
            <Image source={require('./../../../image/pending.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'طلبات معلقة':'Pending Orders'}</Text>
            <Text style={{ color: '#383B43', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.pending_orders_today}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>  this.props.navigation.navigate('DeliveredOrders')}
          style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#383B43'}}>
            <Image source={require('./../../../image/trolley.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#FFCF06', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'طلبات مستلمة':'Delivered Orders'}</Text>
            <Text style={{ color: '#FFCF06', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.delivered_orders_today}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=> this.props.navigation.navigate('Revenue')}
          style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#FFCF01'}}>
            <Image source={require('./../../../image/pending.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'الأيرادات':'Revenue'}</Text>
            <Text style={{ color: '#383B43', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.revenue_today}</Text>
          </TouchableOpacity>
         </View> 

         <View style={{width:'90%',height:1,backgroundColor:'#70707025',marginTop:10}}></View>
         <Text style={{ color: '#212121', fontSize:15,textAlign:'center',marginTop:15,fontFamily:'nexa_bold',}}>
            {this.props.Language=='AR'?'ماذا حدث هذا الشهر':'What Happened This Month'}</Text>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
          <TouchableOpacity
          onPress={()=>  this.props.navigation.navigate('PendingOrders')}
          style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#383B43'}}>
            <Image source={require('./../../../image/pending_y.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#FFCF01', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'طلبات معلقة':'Pending Orders'}</Text>
            <Text style={{ color: '#FFCF01', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.pending_orders_month}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>  this.props.navigation.navigate('DeliveredOrders')}
            style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#FFCF01'}}>
            <Image source={require('./../../../image/trolley_b.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'طلبات مستلمة':'Delivered Orders'}</Text>
            <Text style={{ color: '#383B43', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.delivered_orders_month}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>  this.props.navigation.navigate('Revenue')}
            style={{flex:1,paddingVertical:'5%',borderRadius:10,alignItems:'center',justifyContent:'center',margin:7,backgroundColor:'#383B43'}}>
            <Image source={require('./../../../image/pending_y.png')} style={{ width:45,height:45}} resizeMode='contain' />
            <Text style={{ color: '#FFCF01', fontSize:15,textAlign:'center',marginTop:7,fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'الأيرادات':'Revenue'}</Text>
            <Text style={{ color: '#FFCF01', fontSize:25,textAlign:'center',marginTop:7,fontFamily:'nexa_bold',}}>{this.props.Statistics.revenue_month}</Text>
          </TouchableOpacity>
         </View> 

         <View style={{width:'90%',height:1,backgroundColor:'#70707025',marginTop:10}}></View>
         <Text style={{ color: '#212121', fontSize:15,textAlign:'center',marginTop:15,fontFamily:'nexa_bold',}}>
            {this.props.Language=='AR'?'ماذا حدث هذا الشهر':'Your Client Demography'}</Text>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:5}]}>
          <View style={{flex:1,paddingVertical:'5%',alignItems:'center',justifyContent:'center',margin:7,}}>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'النوع':'Gender'}</Text>
             {/* <View style={{width:70,height:70,borderRadius:70/2,backgroundColor:'#FFCF06',marginTop:10}}></View> */}
             <PieChart
             data={[
               {
                 population: this.props.Statistics.male_percentage?this.props.Statistics.male_percentage:50,
                 color: "#FFCF01",
               },
               {
                 population: this.props.Statistics.female_percentage?this.props.Statistics.female_percentage:50,
                 color: "#383B43",
               },
             ]}
             width={80}
             height={80}
             chartConfig={chartConfig}
             accessor="population"
             backgroundColor="transparent"
             paddingLeft="15"
             absolute
             hasLegend={false}
             />
            <Text style={{ color: '#FFCF01', fontSize:15,textAlign:'center',marginTop:10,fontFamily:'nexa_light',}}>
            {this.props.Statistics.male_percentage} % Male</Text>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:5,fontFamily:'nexa_light',}}>
            {this.props.Statistics.female_percentage} % Female</Text> 
            </View>
          <View style={{flex:1,paddingVertical:'5%',alignItems:'center',justifyContent:'center',margin:7,}}>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'مـــن':'From'}</Text>
            {/* <View style={{width:70,height:70,borderRadius:70/2,backgroundColor:'#FFCF06',marginTop:10}}></View> */}
            <PieChart
             data={[
               {
                 population: this.props.Statistics.male_percentage?this.props.Statistics.male_percentage:50,
                 color: "#FFCF01",
               },
               {
                 population: this.props.Statistics.female_percentage?this.props.Statistics.female_percentage:50,
                 color: "#383B43",
               },
             ]}
             width={80}
             height={80}
             chartConfig={chartConfig}
             accessor="population"
             backgroundColor="transparent"
             paddingLeft="15"
             absolute
             hasLegend={false}
             />
            <Text style={{ color: '#FFCF01', fontSize:15,textAlign:'center',marginTop:10,fontFamily:'nexa_light',}}>
            {this.props.Statistics.male_percentage} % Male</Text>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:5,fontFamily:'nexa_light',}}>
            {this.props.Statistics.female_percentage} % Female</Text>
          </View>
          <View style={{flex:1,paddingVertical:'5%',alignItems:'center',justifyContent:'center',margin:7,}}>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',fontFamily:'nexa_light',}}>
            {this.props.Language=='AR'?'فئـــة':'Category'}</Text>
            {/* <View style={{width:70,height:70,borderRadius:70/2,backgroundColor:'#FFCF06',marginTop:10}}></View> */}
            <PieChart
             data={[
               {
                 population: this.props.Statistics.male_percentage?this.props.Statistics.male_percentage:50,
                 color: "#FFCF01",
               },
               {
                 population: this.props.Statistics.female_percentage?this.props.Statistics.female_percentage:50,
                 color: "#383B43",
               },
             ]}
             width={80}
             height={80}
             chartConfig={chartConfig}
             accessor="population"
             backgroundColor="transparent"
             paddingLeft="15"
             absolute
             hasLegend={false}
             />
            <Text style={{ color: '#FFCF01', fontSize:15,textAlign:'center',marginTop:10,fontFamily:'nexa_light',}}>
            {this.props.Statistics.male_percentage} % Male</Text>
            <Text style={{ color: '#383B43', fontSize:15,textAlign:'center',marginTop:5,fontFamily:'nexa_light',}}>
            {this.props.Statistics.female_percentage} % Female</Text>
          </View>
         </View> 

       </View>
   )
  }

  renderTab2() {
   return (
       <View style={{ width:width,justifyContent:'center',alignItems:'center' }}>
          <View style={[this.props.Language=='AR'?styles.leftItem:styles.rightItem,{width:'93%',marginTop:'5%'}]}>
             <TouchableOpacity
             onPress={()=> this.props.navigation.navigate('AddProduct')}
             style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center'}}>
              <Icon name="plus" size={17} color="#212121" style={{}} />
             </TouchableOpacity>

             <TouchableOpacity
               onPress={() => {
                  if(this.state.flag_filter==1){
                   this.setState({flag_filter:2})
                }else{
                   this.setState({flag_filter:1})
                }
             }}
             style={{width:60,alignItems:'center',justifyContent:'center',marginTop:'1%',flexDirection:'row',marginHorizontal:'10%'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'تصنيف':'Filter'}</Text>
             <Image source={require('./../../../image/sort.png')} style={{ width:20,height:20}}/>
             </TouchableOpacity>

             <TouchableOpacity  
             onPress={()=> 
               // this.props.navigation.navigate('Views')
               this.setState({flag_view:5})
            }
             style={{width:60,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'نظرات':'View'}</Text>
             <Icon name="bars" size={25} color="#FFCF01" style={{}} />
             </TouchableOpacity>
          </View>
          <FlatList style={{width:'98%',marginTop:5}}
               data={this.state.products}
               numColumns={2}
               showsVerticalScrollIndicator={false}
               renderItem={({index, item }) => this.renderItem(index,item)}
               keyExtractor={(item, index) => index.toString()}
             />
       </View>
   )
  }

  renderTab3() {
   return (
       <View style={{ width:width,justifyContent:'center',alignItems:'center' }}>
          <View style={[this.props.Language=='AR'?styles.leftItem:styles.rightItem,{width:'93%',marginTop:'5%'}]}>
             <TouchableOpacity
              onPress={() =>  this.props.navigation.navigate('AddCustomization')} 
             style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center'}}>
              <Icon name="plus" size={17} color="#212121" style={{}} />
             </TouchableOpacity>

             <TouchableOpacity
               onPress={() => {
                  if(this.state.flag_filter==1){
                   this.setState({flag_filter:2})
                }else{
                   this.setState({flag_filter:1})
                }
             }}
             style={{width:60,alignItems:'center',justifyContent:'center',marginTop:'1%',flexDirection:'row',marginHorizontal:'10%'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'تصنيف':'Filter'}</Text>
             <Image source={require('./../../../image/sort.png')} style={{ width:20,height:20}}/>
             </TouchableOpacity>

             <TouchableOpacity  
             onPress={()=> {
               if(this.state.flag_sort==1){
                  this.setState({flag_sort:2})
               }else{
                  this.setState({flag_sort:1})
               }
             }}
             style={{width:60,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'ترتيب':'Sort'}</Text>
             <Image source={require('./../../../image/sort.png')} style={{ width:25,height:25 ,margin:2}} resizeMode='contain' />
             <Image source={require('./../../../image/arr.png')} style={{ width:15,height:25}} resizeMode='contain' />
             </TouchableOpacity>
          </View>
          {this.props.Style=='list_view'?
           <View style={{width:'100%',height:height*0.15,backgroundColor:'#383B43',marginTop:10}}>
           <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,{width:'100%',}]}>
           <TouchableOpacity
          //  onPress={()=> this.props.navigation.navigate('AddProduct')}
           style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
            <Icon name="chevron-down" size={17} color="#212121" style={{}} />
           </TouchableOpacity>
           <TouchableOpacity
          //  onPress={()=> this.props.navigation.navigate('AddProduct')}
           style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
            <Icon name="chevron-up" size={17} color="#212121" style={{}} />
           </TouchableOpacity>
           <TouchableOpacity
          //  onPress={()=> this.props.navigation.navigate('AddProduct')}
           style={{width:30,height:30,borderRadius:30/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
            <Icon name="trash-o" size={20} color="#212121" style={{}} />
           </TouchableOpacity>
           </View>

           <FlatList style={{width:'100%',position:'absolute',top:'22%',}}
             data={this.props.Customizations}
             horizontal={true}
             showsHorizontalScrollIndicator={false}
             renderItem={({index, item }) => this.renderItemStore(index,item)}
             keyExtractor={(item, index) => index.toString()}
            />
        </View>
          :
          
            this.props.Customizations.map((item, index) => {
               return this.renderOneViewItem(item)
            })
         
          }
         
            
         <TouchableOpacity 
             onPress={() =>  this.props.navigation.navigate('AddCustomization')} 
              style={[styles.Button, styles.shadow, { width: '50%', backgroundColor: '#383B43',flexDirection:'row',marginTop:height*0.1 }]} >
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'أضافة تخصيص' : 'Add Customaization'}
              </Text>
            </TouchableOpacity>
            <FlatList style={{width:'99%',marginTop:10,marginBottom:5}}
               data={this.state.products}
               numColumns={2}
               showsVerticalScrollIndicator={false}
               renderItem={({ index,item }) => this.renderItem(index,item)}
               keyExtractor={(item, index) => index.toString()}
             />
          
       </View>
   )
  }

  renderTab4() {
   return (
       <View style={{  width:width,justifyContent:'center',alignItems:'center'  }}>

         <TouchableOpacity 
           onPress={()=> this.props.navigation.navigate('MyProfile')}
           style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'تعديل الحساب':'Edit Profile'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

         <TouchableOpacity 
         onPress={()=> this.props.navigation.navigate('Staff')}
         style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'العاملين':'Staff'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

         <TouchableOpacity 
          onPress={()=> this.props.navigation.navigate('Drivers')}
          style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'السائقيـن':'Drivers'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

         <TouchableOpacity 
           onPress={()=> this.props.navigation.navigate('Stores')}
           style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'أضافة متجـر':'Add a Store'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

         <TouchableOpacity 
          onPress={()=> this.props.navigation.navigate('StoreProfilePicture')}
          style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'تغير صورة المتجر':'Change Store Profile Picture'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

         <TouchableOpacity style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'معلومات البنـك':'Bank Information'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>
         <TouchableOpacity 
           onPress={()=> this.signOut()}
           style={[styles.shadow,styles.view,this.props.Language=='AR'?styles.rowReversed:styles.row,{}]}>
           <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
           {this.props.Language=='AR'?'تسجيــل الخروج':'LogOut'}
           </Text>
           {this.props.Language=='AR'?
                <Icon name="angle-left" size={24} color={'#383B43'}/>
                  :
               <Icon name="angle-right" size={24} color={'#383B43'}/>
           }
         </TouchableOpacity>

          <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,styles.view,{}]}>
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color: '#FFCF01', fontSize: 18,fontFamily:'nexa_bold'}]}>{this.props.Language=='AR'?'تبديل اللغـة ':'Languahe switcher'}</Text>
                  <View style={[this.props.Language == "AR"?styles.rowReversed:styles.row,{width:'30%',alignItems:'center',justifyContent:'center'}]}>
                  <Text style={{color: '#FFCF01', textAlign:'center',fontSize: 17,fontFamily:'nexa_bold',marginHorizontal:10}}>
                     E
                  </Text>
                   <FlipToggle
                   value={false}
                   buttonWidth={60}
                   buttonHeight={25}
                   buttonRadius={30}
                   sliderWidth={20}
                   sliderHeight={20}
                   sliderRadius={50}
                   buttonOnColor='#F0F2F5'
                   buttonOffColor='#F0F2F5'
                   sliderOnColor='#383B43'
                   sliderOffColor='#383B43'
                   onToggle={(newState) => {
                      if(this.props.Language=='AR'){
                         this.changeLanguage('EN')
                      }else{
                         this.changeLanguage('AR')
                      }
                     //  this.setState({toggleLang:!this.state.toggleLang})
                     }}
                  />
                  <Text style={{color: '#FFCF01', textAlign:'center',fontSize: 17,fontFamily:'nexa_bold',marginHorizontal:10}}>
                     ع
                  </Text>
                 </View>
                  </View>


       </View>
   )
  }

  renderTabView() {
   return (
       <View style={{ width:width,justifyContent:'center',alignItems:'center' }}>
           <View style={[this.props.Language=='AR'?styles.leftItem:styles.rightItem,{width:'93%',marginTop:'4%',marginBottom:'2%'}]}>
             <TouchableOpacity
             onPress={() => {
               if(this.state.flag_filter==1){
                this.setState({flag_filter:2})
             }else{
                this.setState({flag_filter:1})
             }
            }}
             style={{width:60,alignItems:'center',justifyContent:'center',marginTop:'1%',flexDirection:'row',marginHorizontal:'10%'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'تصنيف':'Filter'}</Text>
             <Image source={require('./../../../image/sort.png')} style={{ width:23,height:23}}/>
             </TouchableOpacity>

             <TouchableOpacity  
             onPress={()=>  this.setState({flag_view:5})}
             style={{width:60,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
             <Text style={{ color: '#383B4370', fontSize:14,fontFamily:'nexa_bold',marginHorizontal:5}}>{this.props.Language=='AR'?'نظرات':'View'}</Text>
             <Icon name="th-large" size={25} color="#FFCF01" style={{}} />
             </TouchableOpacity>
          </View>
            {/* <FlatList style={{ width: '98%',marginTop:10,marginBottom:5}}
                data={this.props.Products}
                showsVerticalScrollIndicator={false}
                renderItem={({ index,item }) => this.renderViewItem(index,item)}
                keyExtractor={(item, index) => index.toString()}
              /> */}
               {
                  this.state.products.map((item, index) => {
                     return this.renderViewItem(index , item)
                  })
               }
       </View>
   )
  }

  renderRadio2(clicked){
   return(
    <TouchableOpacity
    style={{width:20,height:20,borderRadius:20/2,borderColor:'#fff',borderWidth:1,margin:3,justifyContent:'center',alignItems:'center'}}
    onPress={()=>{
       this.setState({radioSelected2:clicked})
       if(clicked==1){
         this.setState({sort:'best_seller'})
      }else if(clicked==2){
         this.setState({sort:'highest_price'})
      }else if(clicked==3){
         this.setState({sort:'lowest_price'})
      }else if(clicked=4){
         this.setState({sort:'newly_added'})
      }else{
         this.setState({sort:'alphabetically'})
      }
    }}>
      {this.state.radioSelected2 === clicked?
      <View  style={{width:15 ,height:15 ,borderRadius:15/2,backgroundColor:'#FFCF01'}}></View>
      :
      <View style={{display:'none'}}></View>
      }
    </TouchableOpacity>
   )
 }
   render() {
      return (
         <View style={styles.container} >
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            <Spinner
                    visible={this.props.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
            {this.state.flag_filter==1?
             this.renderHeader(this.props.Language)
            :
            <View style={{display:'none'}}></View>
            }
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
            <View style={{width:width , alignItems:'center',justifyContent:'center'}}>
               <View style={{width:width,alignItems:'center',justifyContent:'center',height:110,backgroundColor:'#FFCF01'}}>
               <FlatList style={{}}
               data={list}
               showsVerticalScrollIndicator={false}
               horizontal={true}
               renderItem={({ item }) => this.renderList(item)}
               keyExtractor={(item, index) => index.toString()}
             />
               </View>
               {this.state.flag_view ==1? this.renderTab1():
               this.state.flag_view ==2? this.renderTab2():
               this.state.flag_view ==3? this.renderTab3():
               this.state.flag_view ==4? this.renderTab4(): this.renderTabView()}
             </View>


            </ScrollView>
            {this.state.flag_filter!=1?
                <View style={styles.filterSection}>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:10,marginTop:15}]}>
                    <Text style={{flex:1,color:'#FFCF01',fontSize:20,fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'تصنيف حسب':'Filter By'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(1)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'رجالى':'Men'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(2)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'حريمى':'Women'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:'3%'}]}>
                      {this.renderRadio(3)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'أطفالى':'Kids'}</Text>
                 </View>
                 <View style={{width:"90%",height:1,backgroundColor:'#707070'}}></View>

               <View style={[styles.searchSection,{ height:40}]}>
               <TextInput
                   style={styles.input}
                   placeholder="Search filter"
                   placeholderTextColor='#000'
                   onChangeText={(searchString) => {this.setState({searchString})}}
                   underlineColorAndroid="transparent"
               />
               </View>
                
                 <View style={{width:"90%",height:1,backgroundColor:'#707070',marginTop:'3%',marginBottom:'3%'}}></View>

                 {/* <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(1)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'جيينز':'Jeans'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(2)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'بنطلونات':'Pants'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{}]}>
                      {this.renderRadio(3)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'قمصان':'Shirts'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{}]}>
                      {this.renderRadio(4)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?' تى شيرتات':'T-Shirts'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{}]}>
                      {this.renderRadio(5)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?' أحذية':'Shoes'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:'3%'}]}>
                      {this.renderRadio(6)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?' ملابس رياضية':'SportsWear'}</Text>
                 </View> */}
                  {
                  listFilter.map((item) => {
                     return this.renderFilter(item)
                  })
                 }


                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:10}]}>
                     <TouchableOpacity 
                       onPress={()=> {
                          this.getProductFilter()
                        }}
                       style={{flex:1 ,alignItems:'center',justifyContent:'center',borderRadius:60,borderColor:'#fff',borderWidth:1}}>
                       <Text style={{textAlignVertical:'center',color:'#FFFFFF',fontSize:18,fontFamily:'nexa_bold',paddingVertical:10}}>{this.props.Language=='AR'?'تنفيذ':'Apply'}</Text>
                     </TouchableOpacity>
                      <View style={{width:'10%'}}></View>
                     <TouchableOpacity 
                       onPress={() => {
                          this.setState({radioSelected: null})
                        if(this.state.flag_filter==1){
                         this.setState({flag_filter:2})
                       }else{
                         this.setState({flag_filter:1})
                       }
                      }}
                     style={{flex:1 ,alignItems:'center',justifyContent:'center',borderRadius:60,borderColor:'#fff',borderWidth:1}}>
                       <Text style={{textAlignVertical:'center', color:'#FFFFFF',fontSize:18,fontFamily:'nexa_bold',paddingVertical:10}}>{this.props.Language=='AR'?'مسـح':'Clear'}</Text>
                     </TouchableOpacity>
                </View>


               </View>
               :
               <View style={{display:'none'}}></View>
               }

            {this.state.flag_sort!=1?
                <View style={styles.sotrSection}>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:10,marginTop:15}]}>
                    <Text style={{flex:1,color:'#FFCF01',fontSize:20,fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'ترتيب حسب':'Sort By'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio2(1)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'أفضل بائع':'Best Seller'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio2(2)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'أعلى سعر':'Highest Price'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{}]}>
                      {this.renderRadio2(3)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'أقل سعر':'Lowest Price'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{}]}>
                      {this.renderRadio2(4)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'مضاف حديثا':'Newly Added'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:'10%'}]}>
                      {this.renderRadio2(5)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'الحروف الأبجدية':'Alphapitical'}</Text>
                 </View>


                 <TouchableOpacity 
                       onPress={() => {
                     //      this.setState({radioSelected: null})
                     //    if(this.state.flag_sort==1){
                     //     this.setState({flag_sort:2})
                     //   }else{
                     //     this.setState({flag_sort:1})
                     //   }
                     this.getProductSort()
                      }}
                     style={{width:'35%',alignItems:'center',justifyContent:'center',borderRadius:60,borderColor:'#fff',borderWidth:1,marginBottom:10}}>
                       <Text style={{textAlignVertical:'center', color:'#FFFFFF',fontSize:18,fontFamily:'nexa_bold',paddingVertical:10}}>{this.props.Language=='AR'?'تنفيـذ':'Apply'}</Text>
                     </TouchableOpacity>


               </View>
               :
               <View style={{display:'none'}}></View>
               }

         </View>
         
      );
   }
}

//redux
const mapStateToProps = state => {
   return {
      Language: state.LanguageReducer.Language,
      Processing: state.AuthReducer.Processing,
      Message: state.AuthReducer.Message,
      User: state.AuthReducer.User,
      Products: state.AuthReducer.Products,
      Statistics: state.AuthReducer.Statistics,
      SellerData: state.AuthReducer.SellerData,
      Customizations: state.AuthReducer.Customizations,
      Style: state.AuthReducer.Style
   }
}
// redux
export default connect(mapStateToProps, { SetLoading , SetLanguage ,getSellerProduct , getStatistics , getProfile , getCustomization})(Home)

const styles = StyleSheet.create({
   flex: {
      flex: 0
   },
   row: {
      flexDirection: 'row'
   },
   rowReversed: {
      flexDirection: 'row-reverse'
   },
   column: {
      flexDirection: 'column'
   },
   shadow: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 5,
   },
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0F2F5',
   },
  searchSection: {
     width:'85%',
     borderRadius:60,
     borderColor:'#707070',
     borderWidth:1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#fff',
     marginTop:10,
     backgroundColor:'#FFFFFF'
},
input: {
   flex:1,
   paddingHorizontal:12,
   padding:0,
   color: '#424242',
},
filterSection:{
   width:width,
   backgroundColor:'#383B43',
   alignItems:'center',
   position:'absolute',top:0
},
sotrSection:{
   width:width,
   backgroundColor:'#383B43',
   alignItems:'center',
   position:'absolute',top:0
},
viewFilter:{
   width:'80%',height:50,
   alignItems:'center',justifyContent:'center'
},
rightItem:{
   alignItems:'flex-start',
   flexDirection:'row-reverse'
},
leftItem:{
   alignItems:'flex-start',
   flexDirection:'row'
},
posRight:{
   right:15
},
posLeft:{
   left:15
},
view:{
   width:'90%',
   alignItems:'center',
   padding:12,
   backgroundColor:'#fff',
   marginTop:15,borderRadius:10
},
right:{
   textAlign:'right'
},
left:{
   textAlign:'left'
},
Button: {
   borderRadius: 60,
   alignItems: 'center',
   justifyContent: 'center',
   paddingVertical: 5,
   marginBottom: 10,
   marginHorizontal: 36
},

});