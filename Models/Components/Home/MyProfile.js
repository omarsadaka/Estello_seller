import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, Image, ScrollView,ImageBackground,TextInput } from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import { Input, Item } from 'native-base'
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';


import { connect } from 'react-redux' // redux
import { SetLoading , getProfile , ChangePwd } from './../../Actions' //redux


class MyProfile extends Component{
   constructor(props) {
      super(props);
      this.state = {
         Processing:false,
         isVisible: false,
         flag_name:1,
         flag_mail:1,
         flag_phone:1,
         userData:{},
         fileName:'',
         store: this.props.SellerData.store,
         photo: this.props.SellerData.photo,
         phone: this.props.SellerData.phone,
         email: this.props.SellerData.email,
         currentPwd:'',
         newPwd:'',
         conf_Pwd:'',
      };
   }
   
   UNSAFE_componentWillMount(){
      this.props.getProfile(this.props.User.token)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.Message != null) {
         alert(nextProps.Message)
    }
  }

    

   renderHeader() {
      return (
         <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
           <View style={{width:40,justifyContent:'center',}}>
           
           </View>
           <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'حسـابى':'My Profile'}</Text>
  
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
    
pickImageFromPhone() {
   const options = {
      title: 'Select Avatar',
      storageOptions: {
         skipBackup: true,
         path: 'images',
      },
   };
   ImagePicker.showImagePicker(options, async(response) => {
      this.props.SetLoading(true)
      // console.log('Response = ', response);
      if (response.didCancel) {
         this.setState({Processing:false})
         console.log('User cancelled image picker');
      } else if (response.error) {
         this.props.SetLoading(false)
         console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
         this.props.SetLoading(false)
         console.log('User tapped custom button: ', response.customButton);
      } else {
         this.props.SetLoading(false)
         const source = { uri: response.uri}
         this.setState({photo: response.uri })
         this.setState({fileName: response.fileName})
         
      }
   });
}
  emailIsValid(email) {
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
 }
 updateUser =()=>{
     const {store  , phone , email , photo , fileName} = this.state
     const data = new FormData();
      data.append({ photo: photo , name: fileName , type: 'image/jpeg' });
      if(store){
          if(email){
            if(this.emailIsValid(email)){
             if(phone){
                this.props.SetLoading(true)
               NetInfo.fetch().then(state =>{
                  if (state.isConnected){
                     try {
                        axios.put('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/update_seller_profile/',
                          {
                           data,store , phone , email
                          }
                        ,{ headers: { 
                           // 'Content-Type': 'multipart/form-data',
                           'Authorization': 'Token '+this.props.User.token
                         }}).then((response)=> {
                           this.props.SetLoading(false)
                               if(response.data.detail){
                                  alert(response.data.detail)
                               }
                        }).catch((error)=> {
                           this.props.SetLoading(false)
                           alert(error)
                           console.log(error.response.data)
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
                alert('Enter Your Phone')
             }
          }else{
             alert('Enter Your Email')
          }
    }else{
       alert('Enter Store Name')
    }
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
                  <TouchableOpacity 
                     onPress={()=> this.setState({isVisible: true})}
                     style={{width:40,height:40,marginTop:10,alignItems:'center',alignSelf:'flex-end',justifyContent:'center',borderRadius:40/2,backgroundColor:'#383B43'}}>
                    <Image source={require('./../../../image/edit2.png')} style={{ width:20,height:20}} resizeMode='contain' />
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=>this.pickImageFromPhone()} 
                  style={[styles.shadow,{width:120,height:120,borderRadius:120/2,alignItems:'center',justifyContent:'center',backgroundColor:'#9B9191'}]}>
                  <Image
                   source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+this.state.photo}} resizeMode='cover'
                   style={{width:120,height:120,borderRadius:120/2}}>
                  </Image>
                  <Image source={require('./../../../image/plus.png')} style={{ width:70,height:70,position:'absolute'}} resizeMode='contain' />
                  </TouchableOpacity>
                  <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',height:40,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                     {this.state.flag_name==1?
                     <Text style={{flex:1,textAlign:'center',color: '#383B43', fontSize: 22,fontFamily:'nexa_bold'}}>
                     {this.state.store}</Text>
                     :
                     <TextInput
                     style={{flex:1 , height:'100%', color:'#383B43',fontSize:15,fontFamily:'nexa_bold'}}
                     placeholder="Enter Store name"
                     onChangeText={(store) => {
                        this.setState({store})
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
                  <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,{width:'100%',height:55,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                    <Text style={{fontSize:17,color:'#111111',textAlign:'center',fontFamily:'nexa_bold',paddingHorizontal:10}}>
                    {this.props.SellerData.city}</Text>
                    <Image source={require('./../../../image/city.png')} resizeMode='contain'
                      style={{ width: 45, height: 40, }} />
                    </View>
                 
                    <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'60%',height:40,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                    <TouchableOpacity
                  //   onPress={()=>this.setState({flag_name:2})}
                    >
                   <Image source={require('./../../../image/call.png')} style={{ width:20,height:20}} resizeMode='contain' />
                   </TouchableOpacity>
                     {this.state.flag_phone==1?
                     <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color: '#383B43', fontSize: 15,fontFamily:'nexa_light',paddingHorizontal:10}]}>{this.state.phone}</Text>
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
                     <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,color: '#383B43', fontSize: 15,fontFamily:'nexa_light',paddingHorizontal:10}]}>{this.state.email}</Text>
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
                            onPress={() => { this.updateUser()}}
                             style={[styles.Button, styles.shadow, { }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? ' تحديث' : 'Update'}
                                </Text>
                            </TouchableOpacity>
                        </View>


            <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             swipeDirection="left"
             >
          <View style={styles.modal}>
             <View style={[this.props.Language == "AR" ? styles.rowReversed : styles.row,{width:'100%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible:false})}>
               <Icon name="close" size={25} color="#000" style={{margin:10}} />
               </TouchableOpacity>
            </View>
            <Text style={{ width: '100%',textAlign:'center',alignItems:'center',color:'#000', fontSize:16,fontFamily:'nexa_bold',}}>
            {this.props.Language == "AR" ? 'تغير الرقم السرى' : 'Change Password'}
            </Text>
           
            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                 <Item style={[styles.inputFields,{ marginTop: 12 }]}>
                    <Input
                    placeholderTextColor='#919191'
                    secureTextEntry
                    placeholder={this.props.Language == "AR" ? ' أدخل الرقم السرى الحالى' : 'Enter current password'}
                    style={{ color: '#000',fontFamily:'nexa_bold',fontSize:14,borderColor:'#E4E4E4',borderRadius:60,borderWidth:1 }} textAlign={'center'}
                    onChangeText={(text) => this.setState({ currentPwd: text })} />
                 </Item>
            </View>

            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                 <Item style={[styles.inputFields,{ marginTop: 12 }]}>
                    <Input
                    placeholderTextColor='#919191'
                    secureTextEntry
                    placeholder={this.props.Language == "AR" ? ' الرقم السرى الجديد' : 'New password'}
                    style={{ color: '#000',fontFamily:'nexa_bold',fontSize:14,borderColor:'#E4E4E4',borderRadius:60,borderWidth:1 }} textAlign={'center'}
                    onChangeText={(text) => this.setState({ newPwd: text })} />
                 </Item>
            </View>

            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                 <Item style={[styles.inputFields,{ marginTop: 12 }]}>
                    <Input
                    placeholderTextColor='#919191'
                    secureTextEntry
                    placeholder={this.props.Language == "AR" ? 'تأكيد الرقم السرى' : 'Confirm password'}
                    style={{ color: '#000',fontFamily:'nexa_bold',fontSize:14,borderColor:'#E4E4E4',borderRadius:60,borderWidth:1 }} textAlign={'center'}
                    onChangeText={(text) => this.setState({ conf_Pwd: text })} />
                 </Item>
            </View>
                <TouchableOpacity 
                onPress={() => { 
                   const { currentPwd , newPwd , conf_Pwd }= this.state
                   if(currentPwd){
                      if(newPwd){
                         if(newPwd == conf_Pwd){
                           this.props.ChangePwd(this.props.User.token , currentPwd , newPwd)
                         }else{
                            alert('Password not matches')
                         }

                      }else{
                         alert('Enter New Password')
                      }

                   }else{
                      alert('Enter Current Password')
                   }
                 }} 
                style={[styles.shadow,styles.Button,{width:width*0.6,alignItems:'center',justifyContent:'center',marginTop:20}]} >
                <Text style={{ color: '#FFCF06', fontSize: 14,fontFamily:'nexa_bold',fontWeight:'bold' }}>
                {this.props.Language == "AR" ? 'أنشاء كلمة مرور جديدة' : 'Create New Password'}
                </Text>
                </TouchableOpacity>
           
         </View>
         
          </Modal>

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
       SellerData: state.AuthReducer.SellerData
    }
 }
export default connect(mapStateToProps, { SetLoading , getProfile , ChangePwd})(MyProfile)

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
      marginHorizontal: 36,
      backgroundColor: '#383B43'
  },
  modal:{
   width:'100%',
   alignItems:'center',
   backgroundColor:'#fff',
   borderRadius:5,
 },
 inputFields: {
   width:'85%',
   height:50,
   borderBottomColor: '#fff',
},
 });
