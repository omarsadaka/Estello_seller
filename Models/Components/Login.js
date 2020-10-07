import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { SetLoading , UserLogin } from './../Actions' //redux

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
        };
    }

    componentWillMount(){
        this.props.SetLoading(false)
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.Message != null) {
        if (nextProps.Message =='Login Done') {
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'HomeRoutes' })
                ],
            }))
        }else{
            alert(nextProps.Message)
        }
      }
    }

    Login() {
        const { username, password } = this.state
        if(username){
           if(password){
            this.props.UserLogin(username, password)
           }else{
               if(this.props.Language=='AR'){
                alert('أدخل الرقم السرى')
               }else{
                alert('Enter your Password')
               }
           }
        }else{
            if(this.props.Language=='AR'){
                alert('أدخل البريد الألكترونى')
               }else{
                alert('Enter your Email')
               }
            
        }
    }

    goHome() {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'HomeRoutes' })
            ],
        }))
    }

    goRegister() {
        this.props.navigation.navigate('Register')
    }

    renderHeader() {
        return (
           <View style={[styles.flex, styles.shadow, { width: width, height: height*0.4, alignItems: 'center', justifyContent: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
               <Image source={require('./../../image/logo.png')} style={[styles.image, {  }]} resizeMode='contain' />
              <Text style={{ color: '#fff', fontSize: 27,fontFamily:'nexa_light',position:'absolute',bottom:'10%' }}>{this.props.Language=='AR'?'تسجيل الدخول':'Sign In'}</Text>
           </View>
        )
  }

    render() {
        return (
            <View style={styles.container}>
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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
                   
                    <Text style={{ color: '#383B4370', fontSize: 14,fontFamily:'nexa_bold',marginTop:'10%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'الايميل \ رقم الموبايل':'Email ID / Mobile Number'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: '3%',}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#000' }} textAlign={'center'}
                                    onChangeText={(text) => this.setState({ username: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B4370', fontSize: 14,fontFamily:'nexa_bold',marginTop:'7%',paddingHorizontal:'5%'}}>{this.props.Language=='AR'?'الرقم السرى':'Password'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 12 }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={true}
                                    style={{ color: '#000' }} textAlign={'center'}
                                    onChangeText={(text) => this.setState({ password: text })} />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity 
                        style={{width:'80%',}}
                        onPress={() =>         this.props.navigation.navigate('ForgetPassword')}>
                            <Text style={{ width:'100%',textAlign:'right',fontSize: 13, fontFamily:'nexa_bold',color:'#383B4370',margin:3 }} >
                                {this.props.Language == "AR" ? 'فقدت كلمة المرور؟' : 'Forgot Password?'}
                            </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 36 }]}>
                            <TouchableOpacity onPress={() => {
                                 this.Login() 
                                // this.goHome()
                                 }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? 'تسجيل الدخول' : 'Login'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',marginTop:5 }]}>
                          <Text style={{ color: '#383B4370', fontSize: 13,fontFamily:'nexa_light',margin:2}}>
                                    {this.props.Language == "AR" ? 'ليس لديك حساب؟' : 'Dont Have Account?'}
                                </Text>
                            <TouchableOpacity onPress={() => this.goRegister()} style={[ { }]} >
                                <Text style={{ color: '#383B43', fontSize: 13, fontFamily:'nexa_bold',margin:2}}>
                                    {this.props.Language == "AR" ? 'انشاء حساب' : 'Sign Up'}
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
export default connect(mapStateToProps, { SetLoading , UserLogin })(Login)

const styles = StyleSheet.create({
    flex: {
        flex: 0
    },
    row: {
        flexDirection: 'row'
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
        elevation: 3,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
    },
    inputFields: {
        width:'85%',
        height:50,
        borderBottomColor: '#F0F2F5',
    },
    Button: {
        width:'35%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginBottom: 18,
        marginHorizontal: 36
    },
    image: {
        width: 150,
        height: 80
    },
});