import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, TextInput,Image, AsyncStorage,ImageBackground,FlatList } from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux' // redux
import { SetLoading } from './../../Actions' //redux
const list = [{ id: 1 }, { id: 2 }, { id: 3 }]

class Stores extends Component{
   constructor(props) {
      super(props);
      this.state = {
         Processing:false,
         addresses:[]
      };
   }
   
   UNSAFE_componentWillMount(){
      this.getAddresses(this.props.User.token)
    }
  
    getAddresses = (Token) => {
      NetInfo.fetch().then(state =>{
         if (state.isConnected){
       try {
           this.props.SetLoading(true)
           axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/location/',{
            headers: {
               'Authorization': 'Token '+Token,
             }
           })
           .then((response)=> {
               this.props.SetLoading(false)
               const Data = response.data.list;
                const addresses = []
               for (let index = 0; index < Data.length; index++) {
               var obj = {
                   id: Data[index].id,
                   city: Data[index].city,
                   lat: Data[index].lat,
                   lon: Data[index].lon,
                   location_name: Data[index].location_name,
                   area: Data[index].area,
                   block_no: Data[index].block_no,
                   street_no: Data[index].street_no,
                   building: Data[index].building,
                   floor: Data[index].floor,
                   appartment_no: Data[index].appartment_no,
               }
               addresses.push(obj)
          }
           this.setState({addresses})
           if(this.state.addresses.length==0){
              if(this.props.Language=='AR'){
                 alert('لا يوجد فروع')
              }else{
               alert('No Branches Now')
              }
         }
           }).catch(function (error) {
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
         if(this.props.Language=='AR'){
            alert('لا يوجد أتصال بالانترنت')
          }else{
            alert('No internet connection')
          }
        }
      });
      
}

renderItem(index,item) {
   return (
      <TouchableOpacity activeOpacity={1}
      onPress={() => {
         const obj={
            id: item.id,
            lat: item.lat,
            lon: item.lon,
            addressName: item.location_name,
            area: item.area,
            streetName: item.street_no,
            block_no: item.block_no,
            building: item.building,
            floor: item.floor,
            appartment_no: item.appartment_no
         }
         AsyncStorage.setItem('Address', JSON.stringify(obj))
         this.props.navigation.navigate('EditStore')
      }} 
      key={index.toString()} style={[ { justifyContent: 'center',margin:4 }]} >
             <View style={[styles.shadow,{ width: '100%', height: 130,justifyContent:"center",alignItems:'center', borderRadius:10 ,backgroundColor:'#fff'}]}>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#212121',fontFamily:'nexa_bold',margin:3}]}>
                {item.location_name}</Text>
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:11,color:'#707070',fontFamily:'nexa_light',margin:3}]}>
                 {item.street_no} {','} {item.city} {','} {item.location_name}</Text>
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:11,color:'#707070',fontFamily:'nexa_light',margin:3}]}>
                {item.area} {','} {item.block_no} {','} {item.building}</Text>
            </View>
      </TouchableOpacity>
   )
}
   renderHeader() {
      return (
         <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
           <View style={{justifyContent:'center',margin:5,}}>
            <TouchableOpacity
            onPress={()=>this.props.navigation.navigate('Cart')}>
           <Icon name="shopping-cart" size={30} color="#FFCF01" style={{}} />
           </TouchableOpacity>
           
           </View>
           <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'المخازن':'Stores'}</Text>
  
              <View style={{width:40,justifyContent:'center'}}>
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

    render(){
        return(
            <View style={styles.container} >
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            {this.renderHeader(this.props.Language)}
            <View style={{width:width ,flex:1, alignItems:'center'}}>
            <View style={[styles.searchSection,this.props.Language=='AR'?styles.row:styles.rowReversed]}>
                 <TouchableOpacity
                 onPress={()=>this.props.navigation.navigate('PickupLocation')} 
                 style={{width:40 , height:40 , borderRadius:40/2,backgroundColor:'#FFCF01',alignItems:'center' ,justifyContent:'center',margin:5}}>
                 <Icon style={{}} name="map-marker" size={20} color="#383B43"/>
                 </TouchableOpacity> 
                 <TouchableOpacity
                 style={{flex:1,}}
                 onPress={()=>this.props.navigation.navigate('AddNewStore')}>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:15,paddingHorizontal:10,color:'#383B43',fontFamily:'nexa_bold',margin:3}]}>
                 {this.props.Language=='AR'?'أضافة عنوان جديد':'Add New Store'}</Text>
                 </TouchableOpacity>
               </View>
               <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'85%',marginTop:20,alignItems:'center',justifyContent:'center'}]}>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,fontSize:18,color:'#383B43',fontFamily:'nexa_bold',margin:3}]}>
               {this.props.Language=='AR'?'مخازنـى':'My Stores'}</Text>
               <Image source={require('./../../../image/writing.png')} style={{ width:30,height:30,margin:2}} resizeMode='contain' />
               </View>
              <FlatList style={{ width: '98%',marginTop:20,marginBottom:5}}
                data={this.state.addresses}
                showsVerticalScrollIndicator={false}
                renderItem={({ index,item }) => this.renderItem(index,item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            
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
export default connect(mapStateToProps, {SetLoading})(Stores)

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
   searchSection: {
    width:'85%',
    borderRadius:60,
    borderColor:'#707070',
    borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop:20,
    backgroundColor:'#FFFFFF'
},
input: {
  flex:1,
  paddingHorizontal:12,
  padding:0,
  fontSize:14,
  color: '#383B43',
  fontFamily:'nexa_bold'
},
 });
