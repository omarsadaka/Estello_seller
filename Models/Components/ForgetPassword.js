import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, Dimensions, AsyncStorage, YellowBox ,ActivityIndicator} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get('window')
import { Input, Item } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux' // redux
import { SetLanguage, SetLoading , ForgetPwd } from '../Actions' //redux

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:''
        };
    }

    componentDidMount() {
      
    }
  
    componentWillReceiveProps(nextProps) {
        if (nextProps.Message != null) {
        if (nextProps.Message =='Forget Pwd Done') {
            if(this.props.Language=='AR'){
                alert('تم أرسال الكود بنجاح')
            }else{
                alert('reset code sent successfully.')
            }
           this.setState({email:''})
        }else{
            alert(nextProps.Message)
        }
      }
    }
   
      
    renderHeader() {
           return (
              <View style={[styles.flex, styles.shadow, { width: width, height: '27%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
                <View style={[this.props.Language=='AR' ? styles.row_res : styles.row,{width:'95%',alignItems:'center'}]}>
                 {this.props.Language=='AR'?
                 <TouchableOpacity
                 onPress={()=>this.props.navigation.goBack()}>
                <Icon name="angle-right" size={30} color="#fff" style={{margin:10}} />
                </TouchableOpacity>
                 :
                 <TouchableOpacity
                 onPress={()=>this.props.navigation.goBack()}>
                <Icon name="angle-left" size={30} color="#fff" style={{margin:10}} />
                </TouchableOpacity>
                 }
                
              </View>
                 <Text style={{ color: '#fff', fontSize: 27,fontFamily:'nexa_light',position:'absolute',bottom:'10%' }}>{this.props.Language=='AR'?'أعادة كلمة المرور':'Reset Password'}</Text>
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
                <View style={[styles.column]} >

                <Text style={{ color: '#383B4370', fontSize: 14,fontFamily:'nexa_bold',marginTop:'25%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'الايميل':'Email ID'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: '3%',}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    defaultValue={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                />
                            </Item>
                        </View>

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: '10%' }]}>
                            <TouchableOpacity onPress={() => {
                                const {email} = this.state
                                if(email){
                                    this.props.ForgetPwd(email)
                                } else{
                                    if(this.props.Language=='AR'){
                                       alert('أدخل البريد الألكترونى')
                                    }else{
                                       alert('Enter your email')
                                    }
                                }
                                }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? 'تنفيذ' : 'Submit'}
                                </Text>
                            </TouchableOpacity>
                        </View>


                </View>
                <Image source={require('./../../image/bottom_bg.png')} 
               style={{ width: width, height: '10%', position: 'absolute', bottom: 0 }}  resizeMode='stretch' />
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
export default connect(mapStateToProps, { SetLanguage, SetLoading , ForgetPwd})(ForgetPassword)

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
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
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
    text:{
        width:140,height:40,
        borderColor:'#fff',
        borderWidth:1, 
        fontSize: 15,fontFamily:'nexa_bold',
        textAlign:'center',
        textAlignVertical:'center'
    },
    inputFields: {
        width:'85%',
        height:55,
    },
});