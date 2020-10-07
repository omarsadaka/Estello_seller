import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView , AsyncStorage} from 'react-native';
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import { DrawerActions } from 'react-navigation-drawer'
import { CheckBox } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';


import { connect } from 'react-redux' // redux
import { SetLoading } from '../../Actions' //redux


class EditStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            addressInfo:{},
            addressName:'',
            area:'',
            streetName:'',
            blockNum:'',
            buildingNum:'',
            floorNum:'',
            aptNum:'',
            lat:'',
            lon:'',
            id: null
        };
    }
   
    UNSAFE_componentWillMount= async()=>{
        this.props.SetLoading(true)
        const data = await AsyncStorage.getItem('Address');
        if (data) {
          const obj = JSON.parse(data);
          this.setState({ addressInfo: obj })
          this.setState({addressName: obj.addressName , area: obj.area , streetName: obj.streetName})
          this.setState({blockNum: obj.block_no , buildingNum: obj.building , floorNum: obj.floor , aptNum: obj.appartment_no})
          this.setState({lat: obj.lat , lon: obj.lon})
          this.setState({id: obj.id})
          this.props.SetLoading(false)
        } else{
            this.props.SetLoading(false)
            alert('no')
        }
       }

       EditAddresses = (Token , id) => {
        NetInfo.fetch().then(state =>{
           if (state.isConnected){
         try {
            this.props.SetLoading(true)
             axios.put('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/location/'+id+'/',{
                city: this.state.addressName,
                lat: this.state.lat,
                lon: this.state.lon,
                location_name: this.state.streetName,
                area: this.state.area,
                block_no: this.state.blockNum,
                building: this.state.buildingNum,
                floor: this.state.floorNum,
                appartment_no: this.state.aptNum,
             },{
              headers: {
                 'Authorization': 'Token '+Token,
               }
             })
             .then((response)=> {
                 this.props.SetLoading(false)
                if(response.data.detail=='Updated Successfully'){
                    if(this.props.Language=='AR'){
                        alert('تم التعديل')
                      }else{
                        alert('Updated Successfully')
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

    renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity>
             {/* <Icon name="shopping-cart" size={30} color="#FFCF01" style={{}} /> */}
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'تعديل المتجر':'Edit Store'}</Text>
    
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
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 18 }} >
                    
                    <Text style={{color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'أسم العنوان':'Address name'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center'}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.addressName}
                                    onChangeText={(text) => this.setState({ addressName: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'المنطقـة':' Area'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.area}
                                    onChangeText={(text) => this.setState({ area: text })} />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'أسم الشارع':'Street name'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center'}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.streetName}
                                    onChangeText={(text) => this.setState({ streetName: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'رقم القطاع':'Block Number'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.blockNum}
                                    onChangeText={(text) => this.setState({ blockNum: text })} />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?' رقم المبنـى':' Building Number'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.buildingNum}
                                    onChangeText={(text) => this.setState({ buildingNum: text })} />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'رقم الطابق':'Floor Num'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center'}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.floorNum}
                                    onChangeText={(text) => this.setState({ floorNum: text })}
                                />
                            </Item>
                        </View>
                        <Text style={{ color: '#383B43', fontSize: 14,fontFamily:'nexa_bold',marginTop:20,paddingHorizontal:'4%'}}>{this.props.Language=='AR'?'رقم الشقة':'Apt Num'}</Text>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    style={{ color: '#383B43',fontSize:14,fontFamily:'nexa_light' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    value={this.state.aptNum}
                                    onChangeText={(text) => this.setState({ aptNum: text })} />
                            </Item>
                        </View>

                       

                       

                       

                        

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 30 }]}>
                            <TouchableOpacity onPress={() => { 
                                this.EditAddresses(this.props.User.token , this.state.id) 
                                }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
                                <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                                    {this.props.Language == "AR" ? 'تنفيذ' : 'Submit'}
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
export default connect(mapStateToProps, { SetLoading })(EditStore)

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
        width:'95%',
        height:45,
    },
    Button: {
        width: '35%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        marginBottom: 18,
        marginHorizontal: 36
    },
    image: {
        width: 190,
        height: 100,
    },
});