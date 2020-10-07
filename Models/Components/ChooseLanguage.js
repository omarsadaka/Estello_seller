import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, Dimensions, AsyncStorage, YellowBox ,ActivityIndicator} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import { SetLanguage, SaveUser } from '../Actions' //redux

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

class ChooseLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false
        };
    }

    componentDidMount() {
        this.setState({ Processing: true })
        setTimeout(() => {
            AsyncStorage.getItem('Lang').then((val) => {
                if (val) {
                    this.props.SetLanguage(val)
                    AsyncStorage.getItem('User').then((value) => {
                        if (value != null) {
                            const user = JSON.parse(value)
                            this.props.SaveUser(user)
                            this.setState({ Processing: false })
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'HomeRoutes' })
                                ],
                            }))
                        } else {
                            this.setState({ Processing: false })
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'Login' })
                                ],
                            }))
                        }
                    })
                } else {
                    this.setState({ Processing: false })
                }
            })
        }, 1000)
    }

    setAppLanguage = async (lang) => {
        try {
            await AsyncStorage.setItem('Lang', lang).then((value) => {
                AsyncStorage.getItem('Lang')
                    .then((val) => {
                        this.props.SetLanguage(val)
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Login' })
                            ],
                        }))
                    })
            })

        } catch (error) {
            alert("error")
        }
    };
    renderHeader() {
           return (
              <View style={[styles.flex, styles.shadow, { width: width, height: '27%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
                 <Text style={{ color: '#fff', fontSize: 27,fontFamily:'nexa_light',position:'absolute',bottom:'10%' }}>Select Language</Text>
                 <View></View>
              </View>
           )
     }
    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor='#383B43' barStyle="light-content" />
                {this.state.Processing?
                <ActivityIndicator 
                size="large"
                color='#C8972C'
                style={{left: 0,
                  position: 'absolute',
                  right: 0,
                  top: '35%',
                  zIndex: 1}} />
                :
                <View/>
              }
               {this.renderHeader()}
               <View style={{width:'30%',height:'1%',backgroundColor:'#FFCF01'}}></View>
                <View style={[styles.column]} >

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: '30%' }]}>
                        <TouchableOpacity onPress={() => this.setAppLanguage("EN")} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43'}]} >
                            <Text style={[styles.text,{ color: '#FFF', }]}>English</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',marginTop: '5%' }]}>
                        <TouchableOpacity onPress={() => this.setAppLanguage("AR")} style={[styles.Button, styles.shadow, { backgroundColor: '#FFCF01'}]} >
                            <Text style={[styles.text,{ color: '#383B43', }]}>عربى</Text>
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
    }
}
// redux
export default connect(mapStateToProps, { SetLanguage, SaveUser })(ChooseLanguage)

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
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    Button: {
        width:150,
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
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
    }
});