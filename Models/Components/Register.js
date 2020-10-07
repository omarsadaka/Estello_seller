import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView ,Image} from 'react-native';
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CheckBox } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';


import { connect } from 'react-redux' // redux
import { UserRegister , SetLoading } from './../Actions' //redux

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store:'',
            password: '',
            mobile: '',
            email: null,
            checked:false,
            locations:{
                city:'cairo',
                lat:'24.69497',
                lon:'46.72413'
            },
            bg3:'#D8D8D8',
            bg2:'#D8D8D8',
            bg1:'#D8D8D8',
            cash:false,
            k_net:false,
            credit_card:false,
            drivers:[
                {
                    label: 'Local Driver',
                    value: 1,
                },
                {
                    label: 'Your Driver',
                    value: 2,
                },
            ],
            delivery_method: '',
            color:'#383B4370'
        };
    }

    componentWillMount(){
        this.props.SetLoading(false)
    }

    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Message != null) {
        if (nextProps.Message=='Register Done') {
            if(this.props.Language=='AR'){
                alert('تم التسجيل بنجاح')
            }else{
                alert('successfully sign up')
            }
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Login' })
                ],
            }))
        }else{
            alert(nextProps.Message)
        }
      }
    }

    Register() {
        const { store , password, conf_password , mobile , email ,delivery_method,checked,locations , k_net , cash , credit_card } = this.state
            if(store.length>=1){
                if(email.length>=1){
                    if(this.emailIsValid(email)){
                        if(mobile){
                            if(mobile.startsWith('+20')){
                                if(password.length>=1){
                                    if(password===conf_password){
                                        if(delivery_method.length>=1){
                                            if(checked){
                                                this.props.UserRegister(store, email, mobile,checked,password,cash,k_net,credit_card,delivery_method ,locations)
                                            }else{
                                                alert('You must accept terms of use')
                                            }
                                        }else{
                                            if(this.props.Language=='AR'){
                                                alert('أختر طريقة التوصيل')
                                               }else{
                                                alert('Choose Delivery Method')
                                               }
                                        }
                                    }else{
                                        if(this.props.Language=='AR'){
                                            alert('الرقم السرى غير متطابق')
                                           }else{
                                            alert('Your Password Do not match')
                                           }
                                       
                                    }
        
                                }else{
                                    if(this.props.Language=='AR'){
                                        alert('يجب أدخال الرقم السرى')
                                       }else{
                                        alert('You Must Enter Your Password')
                                       }
                                    
                                }
                            }else{
                                if(this.props.Language=='AR'){
                                    alert('رقم الهاتف يجب أن يبدأ +20')
                                   }else{
                                    alert('Phone must begin with +20')
                                   }
                            }
                        }else{
                            if(this.props.Language=='AR'){
                                alert('يجب أدخال رقم الهاتف')
                               }else{
                                alert('You must enter your phone')
                               }
                          
                        }
                       
                    }else{
                        if(this.props.Language=='AR'){
                            alert('البريد الألكترونى غير صحيح')
                           }else{
                            alert('Email is not valid')
                           }
                        
                    }

                }else{
                    if(this.props.Language=='AR'){
                        alert('يجب أدخال البريد الألكترونى')
                       }else{
                        alert('You Must Enter Your Email')
                       }
                   
                }

            }else{
                if(this.props.Language=='AR'){
                    alert('يجب أدخال أسم المتجر ')
                   }else{
                    alert('You Must Enter Store Name')
                   }
                
            }

       
    }


    renderHeader() {
        return (
           <View style={[styles.flex, styles.shadow, { width: width, height: height*0.27, alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={[this.props.Language=='AR' ? styles.row_res : styles.row,{width:'98%'}]}>
             <View style={{justifyContent:'center',margin:5,position:'absolute',top:'5%'}}>
              {this.props.Language=='AR'?
              <TouchableOpacity
              onPress={()=>this.props.navigation.goBack()}>
             <Icon name="angle-right" size={30} color="#fff" style={{}} />
             </TouchableOpacity>
              :
              <TouchableOpacity
              onPress={()=>this.props.navigation.goBack()}>
             <Icon name="angle-left" size={30} color="#fff" style={{}} />
             </TouchableOpacity>
              }
             </View>
             <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:'7%'}}>
             <Image source={require('./../../image/logo.png')} style={[styles.image, {  }]} resizeMode='contain' />
             </View>
           </View>
              <Text style={{ color: '#fff', fontSize: 27,fontFamily:'nexa_light',position:'absolute',bottom:'10%' }}>{this.props.Language=='AR'?'أنشاء حساب':'Sign Up'}</Text>
              <View></View>
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
                <View style={{width:'30%',height:'1%',backgroundColor:'#FFCF01'}}></View>
                <KeyboardAvoidingView
                    enabled
                    behavior="height"
                    style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }} >
                    
                   
                    <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*المتجر ':'Store* '}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    onChangeText={(text) => this.setState({ store: text })}
                                />
                            </Item>
                    </View>
                    <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*الايميل ':'Email ID* '}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
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
                                    onChangeText={(text) => this.setState({ mobile: text })} />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*الرقم السرى':'Password*'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    secureTextEntry
                                    style={{ color: '#000' }} textAlign={'center'}
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
                                    onChangeText={(text) => this.setState({ conf_password: text })} />
                            </Item>
                        </View>

                        <Text style={{ color: '#383B4370', fontSize: 15,fontFamily:'nexa_bold',marginTop:'4%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'*السائقين':'Drivers*'}</Text>
                        <View style={[this.props.Language=='AR'?styles.row:styles.row_res, { height:50,justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15 }]} >
                        <Icon name="angle-down" size={20} color="#707070" style={{margin:10,paddingHorizontal:10}} />
                        <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                      
                          <ModalDropdown
                           options={this.state.drivers} // data
                           defaultValue={this.props.Language == "AR"?'المنطقة / المحافظة':'How your product will be Delivered'}
                           onSelect={(index, value) => { 
                             this.setState({ delivery_method: value.label , color:'#000' }) 
                           }}
                          renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                          style={{ width:'100%',}} // abl ma t5tar
                          textStyle={[this.props.Language == "AR"?styles.left:styles.right,{fontSize: 14,paddingHorizontal:'10%', color: this.state.color,fontFamily:'nexa_bold'}]}
                          dropdownStyle={[styles.shadow,{ width: '60%', height:100,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
                         renderRow={function (rowData, rowID, highlighted) {
                         return (
                           <View style={[ {width:'100%', backgroundColor: '#FCFCFC',justifyContent: 'center', alignItems: 'center', height: 40,}]}>
                         <Text style={[{ width:'100%',fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'nexa_bold',}, highlighted && { color: '#BDBDBD' }]}>
                          {rowData.label}
                         </Text>
                         </View>
                        );
                        }.bind(this)}
                       />
                     </View>  
                    </View>

                       

                       

                <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:14,color:'#383B43',fontFamily:'nexa_bold',marginTop:15}]}>
                    {this.props.Language=='AR'?' طريقة الدفع':' Payment Method'}</Text>
                <View style={[this.props.Language=='AR'?styles.row_res:styles.row,{width:'90%',marginTop:5,padding:5,alignItems:'center',justifyContent:'center'}]}>
                <TouchableOpacity 
                 onPress={()=>{
                    if(this.state.bg1=='#D8D8D8') {
                        this.setState({bg1:'#FFCF01'})
                        this.setState({cash:true})
                    }else{
                        this.setState({bg1:'#D8D8D8'})
                        this.setState({cash:false})
                    }
               }}
                style={{flex:1,margin:'3%' ,height:100 ,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg1}}>
                <Image source={require('./../../image/cash.png')} style={{ width:50,height:50,position:'absolute',top:10}} resizeMode='contain'/>
                <Text style={{flex:1,textAlign:'right',color:'#383B43',fontSize:14,fontFamily:'nexa_light',position:'absolute',bottom:10}}>
                Cash</Text>
               </TouchableOpacity>
               <TouchableOpacity 
               onPress={()=>{
                if(this.state.bg2=='#D8D8D8') {
                    this.setState({bg2:'#FFCF01'})
                    this.setState({k_net:true})
                }else{
                    this.setState({bg2:'#D8D8D8'})
                    this.setState({k_net:false})
                }
               }}
                style={{flex:1,margin:'3%' ,height:100 , borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg2}}>
                 <Image source={require('./../../image/net.png')} style={{ width:50,height:50,position:'absolute',top:10}} resizeMode='contain'/>
                <Text style={{flex:1,textAlign:'right',color:'#383B43',fontSize:14,fontFamily:'nexa_light',position:'absolute',bottom:10}}>
                 K-Net</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                  onPress={()=>{
                    if(this.state.bg3=='#D8D8D8') {
                        this.setState({bg3:'#FFCF01'})
                        this.setState({credit_card:true})
                    }else{
                        this.setState({bg3:'#D8D8D8'})
                        this.setState({credit_card:false})
                    }
                 }}
                style={{flex:1,margin:'3%' ,height:100 , borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:this.state.bg3}}>
                 <Image source={require('./../../image/credit.png')} style={{ width:50,height:50,position:'absolute',top:10}} resizeMode='contain'/>
                 <Text style={{flex:1,textAlign:'right',color:'#383B43',fontSize:14,fontFamily:'nexa_light',position:'absolute',bottom:10}}>
                   Credit Card</Text>
                 </TouchableOpacity>
                 </View>

                        <View style={[this.props.Language=='AR' ? styles.row : styles.row_res, { marginTop: 7, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ alignSelf: 'center', color: '#383B4370', fontSize: 14,fontFamily:'nexa_light' }}>
                                {this.props.Language == "AR" ? 'موافق على الشروط المستخدمة' : 'I agree to the terms Of Use'}
                            </Text>
                            <CheckBox
                                checked={this.state.checked}
                                onPress={() =>{
                                    this.setState({checked: !this.state.checked});
                                    }}
                            />
                        </View>

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 7 }]}>
                            <TouchableOpacity onPress={() => { this.Register() }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? ' أنشاء الحساب' : 'SignUp'}
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
export default connect(mapStateToProps, { UserRegister , SetLoading })(Register)

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
        width: '35%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginBottom: 18,
        marginHorizontal: 36
    },
    image: {
        width: 190,
        height: height*0.12,
    },
});