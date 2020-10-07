import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, Image, ScrollView,AsyncStorage,TextInput } from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';

import { connect } from 'react-redux' // redux
import { SetLoading  } from './../../Actions' //redux


class DriverProfile extends Component{
   constructor(props) {
      super(props);
      this.state = {
         Processing:false,
         flag_name:1,
         flag_mail:1,
         flag_phone:1,
         driverData:{},
         name:'',
         phone: '',
         email: '',
      };
   }
   
   UNSAFE_componentWillMount= async()=>{
      this.props.SetLoading(false)
      const data = await AsyncStorage.getItem('DriverData')
        if(data){
            const info = JSON.parse(data)
            this.setState({driverData: info})
            this.setState({name: info.name , phone: info.phone , email: info.email  })
        }
    }
    emailIsValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    updateDriver =(Token)=>{
      const {name  , phone , email } = this.state
       if(name){
           if(phone){
              if(email){
                 if(this.emailIsValid(email)){
                  this.props.SetLoading(true)
                  NetInfo.fetch().then(state =>{
                     if (state.isConnected){
                        try {
                           axios.put('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/driver/profile/'+this.state.driverData.id+'/',
                             { 
                               name , phone , email 
                             }
                           ,{ headers: { 
                              'Authorization': 'Token '+Token
                            }}).then((response)=> {
                              this.props.SetLoading(false)
                                  if(response.data.detail){
                                     alert(response.data.detail)
                                  }
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
               this.props.SetLoading(false)
                alert("No internet connection")
                }
              });
                }else{
                  alert('Enter Valid Email First')
             }
              }else{
               alert('Enter Staff Email First')
              }
           }else{
              
              alert('Enter Staff Phone First')
           }
     }else{
        alert('Enter Staff Name First')
     }
  }

   

   renderHeader() {
      return (
         <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
           <View style={{width:40,justifyContent:'center',}}>
           
           </View>
           <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'حساب السائـق':'Driver Profile'}</Text>
  
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
         <Spinner
                 visible={this.props.Processing}
                 textContent={'Loading...'}
                 textStyle={{ color: '#FFF' }}
             />
         {this.renderHeader()}
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
          <View style={{width:width,alignItems:'center',justifyContent:"center"}}>
            <View style={{width:width, alignItems:'center',justifyContent:'center',backgroundColor:'#FFCF01',paddingHorizontal:'20%'}}>
               
               <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',height:80,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                  {this.state.flag_name==1?
                  <Text style={{flex:1,textAlign:'center',color: '#383B43', fontSize: 22,fontFamily:'nexa_bold'}}>
                  {this.state.driverData.name}</Text>
                  :
                  <TextInput
                  style={{flex:1 , height:'100%', color:'#383B43',fontSize:15,fontFamily:'nexa_bold'}}
                  placeholder="Enter Nickname"
                  onChangeText={(text) => {
                     this.setState({name: text})
                  }}
                  underlineColorAndroid="transparent"
              />
                  }
                <TouchableOpacity
                 onPress={()=>this.setState({flag_name:2})}>
                <Image source={require('./../../../image/edit.png')} style={{ width:20,height:20}} resizeMode='contain' />
                </TouchableOpacity>
               </View>
            </View>
              
              
                 <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'60%',height:40,alignItems:'center',justifyContent:'center',marginTop:height*0.1}]}>
                 <TouchableOpacity
               //   onPress={()=>this.setState({flag_name:2})}
                 >
                <Image source={require('./../../../image/call.png')} style={{ width:20,height:20}} resizeMode='contain' />
                </TouchableOpacity>
                  {this.state.flag_phone==1?
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color: '#383B43', fontSize: 15,fontFamily:'nexa_light',paddingHorizontal:10}]}>{this.state.driverData.phone}</Text>
                  :
                  <TextInput
                  style={{flex:1 , height:'100%', color:'#383B43',fontSize:15,fontFamily:'nexa_light',paddingHorizontal:10}}
                  placeholder="Enter Phone"
                  onChangeText={(phone) => {this.setState({phone})}}
                  underlineColorAndroid="transparent"
              />
                  }
                <TouchableOpacity
                 onPress={()=>this.setState({flag_phone:2})}>
                <Image source={require('./../../../image/edit.png')} style={{ width:20,height:20}} resizeMode='contain' />
                </TouchableOpacity>
               </View>

               <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'60%',height:40,alignItems:'center',justifyContent:'center',marginTop:5}]}>
               <TouchableOpacity
               //   onPress={()=>this.setState({flag_name:2})}
                 >
                <Image source={require('./../../../image/mail.png')} style={{ width:20,height:20}} resizeMode='contain' />
                </TouchableOpacity>
                  {this.state.flag_mail==1?
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color: '#383B43', fontSize: 15,fontFamily:'nexa_light',paddingHorizontal:10}]}>{this.state.driverData.email}</Text>
                  :
                  <TextInput
                  style={{flex:1 , height:'100%', color:'#383B43',fontSize:15,fontFamily:'nexa_light',paddingHorizontal:10}}
                  placeholder="Enter Email"
                  onChangeText={(email) => {this.setState({email})}}
                  underlineColorAndroid="transparent"
              />
                  }
                <TouchableOpacity
                 onPress={()=>this.setState({flag_mail:2})}>
                <Image source={require('./../../../image/edit.png')} style={{ width:20,height:20}} resizeMode='contain' />
                </TouchableOpacity>
               </View>

               
               
              
               <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: height*0.2 }]}>
                         <TouchableOpacity 
                         onPress={() => { this.updateDriver(this.props.User.token)}}
                          style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                             <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                 {this.props.Language == "AR" ? ' تحديث' : 'Update'}
                             </Text>
                         </TouchableOpacity>
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
       User: state.AuthReducer.User,
       Processing: state.AuthReducer.Processing,
       Message: state.AuthReducer.Message,
    }
 }
export default connect(mapStateToProps, {SetLoading})(DriverProfile)

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
      elevation: 10,
   },
   container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#FFF',
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
  Button: {
     width: '35%',
     borderRadius: 60,
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 10,
     marginBottom: 18,
     marginHorizontal: 36
 },
});
