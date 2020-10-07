import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import { Input, Item } from 'native-base'
import { DrawerActions } from 'react-navigation-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-picker';


import { connect } from 'react-redux' // redux
import { SetLoading , updateProfilePicture } from './../../Actions' //redux


class StoreProfilePicture extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           flag_img_mob:1,
           flag_img_web:1,
           title:'',
           description:'',
           mobile_images:[],
           website_images:[],
          
        };
     }


     UNSAFE_componentWillMount(){
        this.getData(this.props.User.token)
     }


      getData=(Token )=>{
          NetInfo.fetch().then(state =>{
              if (state.isConnected){
          try {
              axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_photos/', {
                  headers: {
                      'Authorization': 'Token '+Token,
                    }
              }).then((response)=> {
                  var Data = response.data
                  var title = Data.title
                  var description= Data.description
                  this.setState({title , description})
                  var mobileArr = response.data.mobile_images
                  var websiteArr = response.data.website_images
                  const mobile_images = []
                  const website_images = []
                  for (let index = 0; index < mobileArr.length; index++) {
                      var obj = {
                          image: mobileArr[index].image,
                          id: mobileArr[index].id,
                          image_type: mobileArr[index].image_type
                      }
                      mobile_images.push(obj)
                  }
                  for (let index = 0; index < websiteArr.length; index++) {
                     var obj = {
                         image: websiteArr[index].image,
                         id: websiteArr[index].id,
                         image_type: websiteArr[index].image_type
                     }
                     website_images.push(obj)
                 }
                 this.setState({mobile_images , website_images})
              }).catch((error)=> {
                 alert(error)
              }).finally(function () {
                  // always executed
              });
          } catch (error) {
              alert('Something went wrong')
          }
      } else {
         if(this.props.Language=='AR'){
           alert('لا يوجد أتصال بالأنترنت')
         }else{
            alert("No internet connection")
         }
         }
       });
      
  }
   
  pickImageFromPhone(id) {
   const options = {
      title: 'Select Image',
      customButton:[
        { name:'customOptionKey' , title:'Choose photo from custom option'},
      ],
      storageOptions: {
         skipBackup: true,
         path: 'images',
      },
   };
   ImagePicker.showImagePicker(options,(response) => {
      this.props.SetLoading(true)
      // console.log('Response = ', response);
      if (response.didCancel) {
         this.props.SetLoading(false)
         console.log('User cancelled image picker');
      } else if (response.error) {
         this.props.SetLoading(false)
         console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
         this.props.SetLoading(false)
         console.log('User tapped custom button: ', response.customButton);
      } else {
         this.props.SetLoading(false)
         const source = { uri: response.uri, fileName: response.fileName }
         if(id==1){
            this.addPhoto(source , 'mobile')
         }else{
            this.addPhoto(source , 'website')
         }
         
        
          
      }
   });
}

   addPhoto = (imagePicked , image_type) =>
     new Promise((resolve, reject) => {
      this.props.SetLoading(true)
      const data = new FormData();
     data.append({ image: imagePicked.uri});
    return axios.post("http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_photos/",
      {data, image_type},
          { headers: { 
            'Authorization': 'Token '+this.props.User.token
       }}).then(response => {
          if(response.data.detail){
             alert(response.data.detail)
          }
      resolve(response)
      console.log(response)
      this.props.SetLoading(false)
    }).catch(error => {
       alert(error)
      reject(error)
      this.props.SetLoading(false)
   });
  });
     renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity>
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'صورة حساب المتجر':'Store Profile Picture'}</Text>
     
                <View style={{width:35,}}>
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

     renderItemMobile(item){
        return(
         <TouchableOpacity
          style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
         <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}}
            style={{width:'100%',height:'100%',borderRadius:5}}></Image>
         </TouchableOpacity>
        )
     }

     renderItemWebsite(item){
      return(
       <TouchableOpacity
        style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
       <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}}
          style={{width:'100%',height:'100%',borderRadius:5}}></Image>
       </TouchableOpacity>
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
            <View style={{width:width , alignItems:'center',justifyContent:'center'}}>

            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:25}]}>{this.props.Language=='AR'?'صور الموبايل':'Mobile Images'}</Text>  
              <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
              <FlatList style={{marginTop:5}}
               data={this.state.mobile_images}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               renderItem={({ item }) => this.renderItemMobile(item)}
               keyExtractor={(item, index) => index.toString()}
              />
               <TouchableOpacity
               onPress={()=>{
                 this.pickImageFromPhone(1)
               }}
               style={{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#FFCF06'}}>
                <Icon name="plus" size={27} color="#fff" style={{}} />
               </TouchableOpacity>
              </View>
              
              
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

               {/* ************************************** */}
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'صور الموقع':'Web Images'}</Text>  
               <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
              <FlatList style={{marginTop:5}}
               data={this.state.website_images}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               renderItem={({ item }) => this.renderItemWebsite(item)}
               keyExtractor={(item, index) => index.toString()}
              />
               <TouchableOpacity
               onPress={()=>{
                  this.pickImageFromPhone(2)
                }}
               style={{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#FFCF06'}}>
                <Icon name="plus" size={27} color="#fff" style={{}} />
               </TouchableOpacity>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

               {/* ************************************** */}

            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.title}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:16,height:50,marginHorizontal:10 }]}
                       onChangeText={(text) => this.setState({ title: text })} />
                  </Item>
               </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'الوصــف':'Description'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.description}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:16,height:height*0.17,textAlignVertical:'top',marginHorizontal:10 }]}
                       onChangeText={(text) => this.setState({ description: text })} />
                  </Item>
               </View>

            {/* ******************************************** */}


                 <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: height*0.1 }]}>
                            <TouchableOpacity onPress={() => { 
                               const { title , description }= this.state
                               if(title){
                                  if(description){
                                     this.props.updateProfilePicture(this.props.User.token , title , description)
                                  }else{
                                    if(this.props.Language=='AR'){
                                       alert('أدخل وصف المتجر أولا')
                                    }else{
                                      alert('Enter Store Description first')
                                    }
                                  }

                               }else{
                                  if(this.props.Language=='AR'){
                                     alert('أدخل عنوان المتجر أولا')
                                  }else{
                                    alert('Enter Store Title first')
                                  }
                               }
                             }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? 'تنفيذ' : 'Submit'}
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
       Processing: state.AuthReducer.Processing,
       Message: state.AuthReducer.Message,
       User: state.AuthReducer.User,
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , updateProfilePicture })(StoreProfilePicture)
 
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
   inputFields: {
    width:'90%',
    color: '#424242',
    backgroundColor:'#fff',
    borderRadius:30,
    marginTop:10,
 },
 right:{
     textAlign:'right'
 },
 left:{
     textAlign:'left'
 },
 Button: {
    width:'30%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 36
},
 });