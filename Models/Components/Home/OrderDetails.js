import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground,StatusBar, Image, ScrollView,TextInput,FlatList } from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
const list = [{ id: 1}, { id: 2 }, { id: 3 }]
const listStores = [{ id: 1 }, { id: 2 }]


import { connect } from 'react-redux' // redux
import { SetLoading  } from './../../Actions' //redux


class OrderDetail extends Component{
   constructor(props) {
      super(props);
      this.state = {
          enableScrollViewScroll: false,
          isVisible: false,
          orderState: 1,
          flag_driver: true,
          list:[],
          listStores:[],
          orderID:'',
          order_id: null,
          number_of_stores: null,
          driver_name: "",
          driver_phone: "",
          client_address: "",
          total: null

      };
   }

   UNSAFE_componentWillMount(){
      const { navigation } = this.props;
      const id = navigation.getParam('ID', 'NO-ID');
      this.setState({order_id: id})
      this.getDetails(this.props.User.token , id)
   }
   
   getDetails=(Token , id)=>{
          NetInfo.fetch().then(state =>{
              if (state.isConnected){
          try {
             this.props.SetLoading(true)
              axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/order/seller_order/'+id+'/', {
                  headers: {
                      'Authorization': 'Token '+Token,
                    }
              }).then((response)=> {
               this.props.SetLoading(false)
                  var Data = response.data.detail
                  this.setState({orderID: Data.orderID})
                  this.setState({number_of_stores: Data.number_of_stores})
                  this.setState({driver_name: Data.driver_name})

                  this.setState({driver_phone: Data.driver_phone})
                  this.setState({client_address: Data.client_address})
                  this.setState({total: Data.total})
                  var Store = response.data.detail.stores
                  const stores = []
                  for (let index = 0; index < Store.length; index++) {
                     var obj = {
                         store: Store[index].store,
                         location: Store[index].location,
                     }
                     stores.push(obj)
                 }
                 var Products = response.data.detail.products
                  const products =[]
                  for (let index = 0; index < Products.length; index++) {
                     var obj = {
                         id: Products[index].id,
                         product_name: Products[index].product_name,
                         quantity: Products[index].quantity,
                         image: Products[index].image,
                         product_size: Products[index].product_size,
                         product_color: Products[index].product_color,
                     }
                     products.push(obj)
                 }

                 this.setState({list: products})
                 this.setState({listStores: stores})
                 
              }).catch((error)=> {
               this.props.SetLoading(false)
                 alert(error)
              }).finally(function () {
                  // always executed
              });
          } catch (error) {
            this.props.SetLoading(false)
              alert("Something went wrong")
          }
      } else {
          alert("No internet connection")
         }
       });
  }

   
   renderHeader() {
      return (
         <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
           <View style={{justifyContent:'center',margin:5,}}>
            <TouchableOpacity
            onPress={()=>alert('search')}>
           <Icon name="search" size={25} color="#fff" style={{}} />
           </TouchableOpacity>
           
           </View>
               <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.state.orderID}</Text>
  
                <View style={{width:30,}}>
                {this.props.Language=='AR'?
                 <TouchableOpacity
                 onPress={()=>this.props.navigation.goBack()}>
                <Icon name="angle-right" size={30} color="#fff" style={{margin:5}} />
                </TouchableOpacity>
                 :
                 <TouchableOpacity
                 onPress={()=>this.props.navigation.goBack()}>
                <Icon name="angle-left" size={30} color="#fff" style={{margin:5}} />
                </TouchableOpacity>
                 }
                </View>
         </View>
      )
  }

  renderStores(item , index){
      return(
    <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginBottom:5}}>
        <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
            <View style={{width:60,height:60,borderRadius:60/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#0D0D0D',fontSize:17,fontFamily:'nexa_bold',position:'absolute',bottom:1}}>{index+1}</Text>
            </View>  
            <View style={{width:35,height:35,borderRadius:35/2,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',position:'absolute',top:0,left:'3%'}}>
             <Icon style={{}} name="map-marker" size={20} color="#383B43"/>
            </View> 
            <View style={{flex:1,alignItems:'center',marginTop:'3%'}}>
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:20,color:'#0D0D0D',fontFamily:'nexa_bold'}]}>
                {item.store}</Text>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#707070',fontFamily:'nexa_light'}]}>
                {item.location}</Text>
                 {/* <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,marginTop:3,color:'#707070',fontFamily:'nexa_light'}]}>
                Plainview ,NY 125458</Text> */}
            </View>
            <View style={{ width:80,height:80,alignItems:'center',justifyContent:'center'}}>
             <Image
               source={require('./../../../image/map.png')}
               style={{  width: '100%', height: '100%',borderRadius:10}} />
               <Icon style={{position:'absolute'}} name="map-marker" size={30} color="#383B43"/>
            </View>
        </View>
         <View style={{width:'100%',height:1,backgroundColor:'#70707021',marginTop:10}}></View>
        </View>
      )
  }

  
    renderItem(index , item) {
      return (
         <TouchableOpacity activeOpacity={1}
         // onPress={() => this.props.navigation.navigate('ProjectInfo')} 
         key={index.toString()} style={[ { justifyContent: 'center',margin:4 }]} >
               <View style={[styles.shadow,this.props.Language=='AR'?styles.rowReversed:styles.row,{ width: '100%', height: height*0.12,alignItems:'center', borderRadius:10 ,backgroundColor:'#fff'}]}>
                  <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}}
                  style={{ width: 80, height: '85%', borderRadius:5,margin:5}} />
                  <View style={{flex:1,height:'99%',justifyContent:'center'}}>
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:15,color:'#212121',fontFamily:'nexa_bold',margin:3}]}>
                   {item.product_name}</Text>
                   <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:13,color:'#707070',fontFamily:'nexa_light',margin:3}]}>
                   Size : {item.product_size}</Text>
                   <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:13,color:'#707070',fontFamily:'nexa_light',margin:3}]}>
                   Color : {item.product_color}</Text>
                  </View>
                   <Text style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{fontSize:13,color:'#707070',fontFamily:'nexa_light',position:'absolute',bottom:10}]}>
                   Quantity : {item.quantity}</Text>
               </View>
         </TouchableOpacity>
      )
   }
 


   render(){
      titleAr1='هل أنت متأكد أنك تريد البدء في تسليم هذا الطلب؟'
      titleAr2='هل تريد بالتأكيد وضع علامة على هذا الطلب على أنه تم تسليمه؟'
      titleEn1='Are you sure you want to start delivering this order ?'
      titleEn2='Are you sure you want to mark this order as Delivered ?'
        return(
            <View style={styles.container}>
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
             {this.renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
               <View style={{width:width , height:'100%',alignItems:'center',justifyContent:'center'}}>
               <View style={{ width: '97%', height: height/4, alignItems:'center',justifyContent:'center',borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFF',marginTop:10 }}>
               <ImageBackground
               resizeMode ="cover"
               source={require('./../../../image/test.png')}
               style={{  width: width, height: '100%', alignItems: 'center', borderRadius:10}} />
              <LinearGradient colors={['#1E1E1E','#353535']} style={styles.linearGradient}/>
               <Text style={{fontSize:24,color:'#FFF',position: 'absolute',fontFamily:'nexa_bold'}}>
                {this.state.number_of_stores}  Stores</Text>
              </View>
                <View style={{width:'100%',alignItems:'center'}}>
                 <FlatList style={{ width: '90%',marginTop:15}}
                data={this.state.listStores}
                showsVerticalScrollIndicator={false}
                renderItem={({ item , index}) => this.renderStores(item ,index)}
                keyExtractor={(item, index) => index.toString()}
              />
             </View>
               
             <View style={{width:'90%',alignItems:'center'}}>
              {/* <FlatList style={{ width: '90%',marginTop:15}}
                data={listStores}
                showsVerticalScrollIndicator={false}
                renderItem={({ item , index}) => this.renderItem(item ,index)}
                keyExtractor={(item, index) => index.toString()}
              /> */}
               {
                  this.state.list.map((item, index) => {
                     return this.renderItem(index , item)
                  })
               }
             </View>
             <View style={[styles.shadow,{width:'90%',alignItems:'center',padding:7,backgroundColor:'#fff',marginTop:15,borderRadius:10}]}>
             {this.state.driver_name!='No Drivers yet'?
              <View style={[this.state.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',}]}>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color:'#FFCF01',fontSize:15,fontFamily:'nexa_bold'}]}> {this.state.driver_name}</Text>
              <Text style={{textAlign:'center',color:'#707070',fontSize:12,fontFamily:'nexa_bold',paddingHorizontal:10}}> {this.state.driver_phone}</Text>
              <View style={{width:40,height:40,borderRadius:40/2,backgroundColor:'#383B44',alignItems:'center',justifyContent:'center'}}>
              <Icon style={{}} name="phone" size={25} color="#FFCF06"/>
              </View>
             </View>
             :
             <View style={[this.state.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',}]}>
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color:'#FFCF01',fontSize:15,fontFamily:'nexa_bold'}]}> 
             {this.props.Language=='AR'?'لا يوجد سائق الأن':'No Driver yet'}</Text>
             <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('Drivers',{order_id: this.state.order_id })}
             style={{width:80,height:27,borderRadius:20,backgroundColor:'#383B44',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#FFCF01',fontSize:12,fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'تخصيـص':'Assign'}</Text>
             </TouchableOpacity>
            </View>
             }
            
            
             </View>
             

             <View style={[this.state.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',marginTop:40,}]}>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color:'#212121',fontSize:17,fontFamily:'nexa_bold'}]}>{this.props.Language=='AR'?'عنوان العميل':'Client Address'}</Text>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#707070',fontFamily:'nexa_light'}]}>
                {this.state.client_address}</Text>
                 {/* <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,marginTop:3,color:'#707070',fontFamily:'nexa_light'}]}>
                Plainview ,NY 125458</Text> */}
            </View>
            <View style={{width:40,height:40,borderRadius:40/2,backgroundColor:'#383B44',alignItems:'center',justifyContent:'center'}}>
             <Icon style={{}} name="map-marker" size={25} color="#FFCF06"/>
            </View>
             </View>
              <View style={{width:'100%',height:1,backgroundColor:'#70707021',marginTop:10}}></View>
              <View style={[this.state.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',marginTop:20,}]}>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color:'#212121',fontSize:17,fontFamily:'nexa_bold'}]}>{this.props.Language=='AR'?'مدة التسليم':'Delivery Period'}</Text>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#707070',fontFamily:'nexa_light'}]}>
                8 to 12 hours</Text>
            </View>
             </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707021',marginTop:10}}></View>
              <View style={[this.state.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',marginTop:20,marginBottom:20}]}>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color:'#212121',fontSize:17,fontFamily:'nexa_bold'}]}>{this.props.Language=='AR'?'عنوان العميل':'Due Amount'}</Text>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#707070',fontFamily:'nexa_light'}]}>
                {this.state.total} KD</Text>
            </View>
             </View>
              
           
              </View>

           </ScrollView>
         </View>
        )
    }
  }

//redux
const mapStateToProps = state => {
    return {
       Language: state.LanguageReducer.Language,
       Processing: state.AuthReducer.Processing,
       Message: state.AuthReducer.Message,
       User: state.AuthReducer.User,
    }
 }
export default connect(mapStateToProps, {SetLoading})(OrderDetail)

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
       justifyContent: 'flex-start',
       alignItems: 'center',
       backgroundColor: '#F0F2F5',
    },
    image: {
       width: 90,
       height: 50
   },
   right:{
      textAlign:'right'
   },
   left:{
      textAlign:'left'
   },
   posRight:{
      right:15
   },
   posLeft:{
      left:15
   },
   Button: {
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      margin:7,
      marginBottom: 10,
  },
  modal:{
   width:'100%',
   height:'50%',
   alignItems:'center',
   justifyContent:'center',
   backgroundColor:'#FFCF01',
   borderRadius:8,
 },

 });
