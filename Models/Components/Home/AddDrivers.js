import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView ,Image} from 'react-native';
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CheckBox } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';


import { connect } from 'react-redux' // redux
import {  SetLoading , addDriver } from './../../Actions' //redux

class AddDrivers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bg3:'#D8D8D8',
            bg2:'#D8D8D8',
            bg1:'#FFCF01',
            admin:true,
            accountant:false,
            seller:false,
            name:'',
            phone:'',
            email:'',
            password:'',
            conf_password:'',

        };
    }

    UNSAFE_componentWillMount(){
        
    }

    componentWillReceiveProps(nextProps) {
       if (nextProps.Message != null) {
           if(nextProps.Message=='Add Driver Done'){
              alert('Add Driver Done')
              this.setState({name:'' , email:'', phone:'', password:'', conf_password:''})
           }else{
             alert(nextProps.Message)
           }
             
     }
   }
   
    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'أضافة سائـق':'Add Driver'}</Text>
     
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
                <KeyboardAvoidingView
                    enabled
                    behavior="height"
                    style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }} >
                    
                    <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*الأسـم ':'Name* '}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.name}
                                    onChangeText={(text) => this.setState({ name: text })}
                                />
                            </Item>
                    </View>
                    <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*الايميل ':'Email ID* '}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?' *رقم الموبايل':' Mobile Number*'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12 }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.phone}
                                    onChangeText={(text) => this.setState({ phone: text })} />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*الرقم السرى':'Password*'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    secureTextEntry
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*تأكيد الرقم السرى':'Confirm Password*'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12 }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={true}
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.conf_password}
                                    onChangeText={(text) => this.setState({ conf_password: text })} />
                            </Item>
                        </View>

                        

                       

                       

                {/* <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:14,color:'#383B4370',fontFamily:'nexa_bold',marginTop:15,paddingHorizontal:'5%'}]}>
                    {this.props.Language=='AR'?'*الترخيـص':' Authrization*'}</Text>
                <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'100%',marginTop:5,alignItems:'center',justifyContent:'center'}]}>
                <TouchableOpacity 
                 onPress={()=>{
                    if(this.state.bg1=='#D8D8D8') {
                        this.setState({bg1:'#FFCF01'})
                        this.setState({bg2:'#D8D8D8'})
                        this.setState({bg3:'#D8D8D8'})
                        this.setState({admin:true})
                    }else{
                        this.setState({bg1:'#D8D8D8'})
                        this.setState({admin:false})
                    }
               }}
                style={{flex:1,margin:5 ,height:50 ,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg1}}>
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light',}}>
                Admin</Text>
               </TouchableOpacity>

               <TouchableOpacity 
               onPress={()=>{
                if(this.state.bg2=='#D8D8D8') {
                    this.setState({bg2:'#FFCF01'})
                    this.setState({bg1:'#D8D8D8'})
                        this.setState({bg3:'#D8D8D8'})
                    this.setState({accountant:true})
                }else{
                    this.setState({bg2:'#D8D8D8'})
                    this.setState({accountant:false})
                }
               }}
                style={{flex:1,margin:5 ,height:50 , borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg2}}>
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light'}}>
                 Accountant</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                  onPress={()=>{
                    if(this.state.bg3=='#D8D8D8') {
                        this.setState({bg3:'#FFCF01'})
                        this.setState({bg1:'#D8D8D8'})
                        this.setState({bg2:'#D8D8D8'})
                        this.setState({seller:true})
                    }else{
                        this.setState({bg3:'#D8D8D8'})
                        this.setState({seller:false})
                    }
                 }}
                style={{flex:1,margin:5 ,height:50 , borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg3}}>
                 <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#383B43',fontSize:15,fontFamily:'nexa_light'}}>
                   Seller</Text>
                 </TouchableOpacity>
                 </View> */}


                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 25 }]}>
                            <TouchableOpacity 
                             onPress={() => {
                                const { name , email , phone , password , conf_password }= this.state
                                   if(name){
                                       if(email){
                                          if(this.emailIsValid(email)){
                                              if(phone){
                                                  if(password){
                                                      if(password==conf_password){
                                                           this.props.addDriver(this.props.User.token,name,email,phone,password)
                                                      }else{
                                                          alert('Passwords Not Matches')
                                                      }
                                                  }else{
                                                      alert('Enter Password First')
                                                  }
                                              }else{
                                                  alert('Enter Phone First')
                                              }
                                          }else{
                                              alert('Enter Valid Email')
                                          }
                                       }else{
                                           alert('Enter Email First')
                                       }
                                   }else{
                                       alert('Enter Name First')
                                   }
                                }} 
                            style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? 'أضافة' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>
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
export default connect(mapStateToProps, { SetLoading , addDriver})(AddDrivers)

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
   
  
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    inputFields: {
        width:'90%',
        height:50,
        borderBottomColor: '#F0F2F5',
    },
    Button: {
        width: '33%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginBottom: 18,
        marginHorizontal: 36
    },
    image: {
        width: 190,
        height: height*0.12,
    },
});