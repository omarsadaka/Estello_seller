import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView ,Image, AsyncStorage} from 'react-native';
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CheckBox } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';


import { connect } from 'react-redux' // redux
import {  SetLoading , resetPwd} from './../../Actions' //redux

class StaffView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bg3:null,
            bg2:null,
            bg1:null,
            staffData:{},
            isVisible: false,
            password:''
        };
    }

   
   UNSAFE_componentWillMount= async()=>{
       const data = await AsyncStorage.getItem('StaffData')
        if(data){
            const info = JSON.parse(data)
            this.setState({staffData: info})
            let auth = info.authorization
            if(auth == 'admin'){
               this.setState({bg1:'#FFCF01' , bg2:'#D8D8D8' , bg3:'#D8D8D8'})
            }else if(auth=='seller'){
                this.setState({bg3:'#FFCF01' , bg2:'#D8D8D8' , bg1:'#D8D8D8'})
            }else{
                this.setState({bg2:'#FFCF01' , bg1:'#D8D8D8' , bg3:'#D8D8D8'})
            }
        }
   }
   

  
    renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.row_res, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity
              style={{width:35,alignItems:'center',justifyContent:'center'}}>
             {/* <Icon name="plus" size={20} color="#212121" style={{}} /> */}
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'تفاصيل العاملين':'Staff View'}</Text>
     
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


    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor='#383B43' barStyle="light-content" />
                <Spinner
                    visible={this.props.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                {this.renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 18 }} >
                <View style={{width:width , alignItems:'center',justifyContent:'center'}}>
                 
                 <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'80%',alignItems:'center',justifyContent:'center',marginTop:15}]}>
                 <Text style={{color:'#383B4370',fontSize:15,fontFamily:'nexa_bold'}}>
                  {this.props.Language=='AR'?'الأسـم :':'Name :'}</Text>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#383B4370',paddingHorizontal:7,fontSize:15,fontFamily:'nexa_bold'}]}>
                 {this.state.staffData.name}</Text>
                 </View>

                  <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'80%',alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  <Text style={{color:'#383B4370',fontSize:15,fontFamily:'nexa_bold'}}>
                  {this.props.Language=='AR'?'الأيميـل :':'Email :'}</Text>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#383B4370',paddingHorizontal:7,fontSize:15,fontFamily:'nexa_bold'}]}>
                 {this.state.staffData.email}</Text>
                 </View>

                  <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'80%',alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  <Text style={{color:'#383B4370',fontSize:15,fontFamily:'nexa_bold'}}>
                  {this.props.Language=='AR'?'رقم الموبايل :':'Mobile number :'}</Text>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#383B4370',paddingHorizontal:7,fontSize:15,fontFamily:'nexa_bold'}]}>
                 {this.state.staffData.phone}</Text>
                 </View>

                 <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'80%',alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  <Text style={{color:'#383B4370',fontSize:15,fontFamily:'nexa_bold'}}>
                  {this.props.Language=='AR'?'الحالــة :':'Status :'}</Text>
                 <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ flex:1,color:'#383B4370',paddingHorizontal:7,fontSize:15,fontFamily:'nexa_bold'}]}>
                 {this.state.staffData.status}</Text>
                 </View>
                      
                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'80%',fontSize:15,color:'#383B4370',fontFamily:'nexa_bold',marginTop:10,}]}>
                {this.props.Language=='AR'?'الترخيـص':' Authrization'}</Text>
                <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'90%',marginTop:5,alignItems:'center',justifyContent:'center'}]}>
                <TouchableOpacity 
                style={{flex:1,margin:5 ,height:50 ,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg1}}>
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light',}}>
                Admin</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                style={{flex:1,margin:5 ,height:50 , borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg2}}>
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light'}}>
                 Accountant</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                style={{flex:1,margin:5 ,height:50 , borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg3}}>
                 <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light'}}>
                   Seller</Text>
                 </TouchableOpacity>
                 </View>


                 <TouchableOpacity 
                  onPress={()=> this.setState({isVisible: true})}
                  style={[styles.shadow,styles.view,{}]}>
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{ width:'95%',color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
                  {this.props.Language=='AR'?'أعادة تعيين كلمة مرور':'Reset Password'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                   onPress={()=> this.props.navigation.navigate('StaffAccount')}
                    
                   style={[styles.shadow,styles.view,{}]}>
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'95%',color:'#FFCF01',fontSize:16,fontFamily:'nexa_bold'}]}>
                  {this.props.Language=='AR'?'تعديل الحساب':'Edit Profile'}</Text>
                </TouchableOpacity>
                
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
            {this.props.Language == "AR" ? 'أعادة تعيين كلمة مرور' : 'Reset Password'}
            </Text>
           
            

            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                 <Item style={[styles.inputFields,{ marginTop: 12 }]}>
                    <Input
                    placeholderTextColor='#919191'
                    secureTextEntry
                    placeholder={this.props.Language == "AR" ? ' أدخل كلمة المرور' : 'Enter password'}
                    style={{ color: '#000',fontFamily:'nexa_bold',fontSize:14,borderColor:'#E4E4E4',borderRadius:60,borderWidth:1 }} textAlign={'center'}
                    onChangeText={(text) => this.setState({ password: text })} />
                 </Item>
            </View>

          
                <TouchableOpacity 
                onPress={() => { 
                   const { password  }= this.state
                   if(password){
                    this.props.resetPwd(this.props.User.token , password , this.state.staffData.id)
                   }else{
                      alert('Enter Password')
                   }
                 }} 
                style={[styles.shadow,styles.Button,{width:width*0.6,alignItems:'center',justifyContent:'center',marginTop:20}]} >
                <Text style={{ color: '#FFCF06', fontSize: 14,fontFamily:'nexa_bold',fontWeight:'bold' }}>
                {this.props.Language == "AR" ? 'تعيين كلمة مرور' : 'Reset Password'}
                </Text>
                </TouchableOpacity>
           
         </View>
         
          </Modal>

                </View>
                 </ScrollView>

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
    }
}
// redux
export default connect(mapStateToProps, { SetLoading , resetPwd })(StaffView)

const styles = StyleSheet.create({
    flex: {
        flex: 0
    },
    row: {
        flexDirection: 'row'
    },
    row_res:{
        flexDirection:'row-reverse'
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
    },
    Button: {
        width: '33%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginBottom: 18,
        marginHorizontal: 36,
        backgroundColor: '#383B43'
    },
    view:{
        width:'90%',
        alignItems:'center',justifyContent:'center',
        height:60,
        backgroundColor:'#fff',
        marginTop:15,borderRadius:10
     },
     right:{
         textAlign:'right'
     },
     left:{
         textAlign:'left'
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