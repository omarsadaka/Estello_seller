import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView ,Image} from 'react-native';
import { Input, Item , Picker} from 'native-base'
const { width, height } = Dimensions.get('window')
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { DrawerActions } from 'react-navigation-drawer'
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';



import { connect } from 'react-redux' // redux
import { } from '../../Actions' //redux

class AddNewStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location:{},
            areas:[
               
                {
                    label: 'Area 1',
                    value: 2,
                },
                {
                    label: 'Area 2',
                    value: 3,
                },
                {
                    label: 'Area 3',
                    value: 4,
                },
            ],
            lat: null,
            lon: null,
            area: '',
            addressName: '',
            streetName: '',
            block_nu: null,
            building_nu: null,
            floor_nu: null,
            apt_no: null
        };
    }

    UNSAFE_componentWillMount= async()=>{
        const data = await AsyncStorage.getItem('Location');
        if (data) {
          const obj = JSON.parse(data);
          this.setState({ location: obj })
          this.setState({lat: obj.lat , lon: obj.lon })
        }
    }
  
    SendLocation = ( ) => {
        const { addressName , area , streetName , block_nu , building_nu , floor_nu , apt_no , lat , lon}= this.state
         if(lat && lon){
            if(addressName && area && streetName && block_nu && building_nu && floor_nu && apt_no){
                NetInfo.fetch().then(state =>{
                    if (state.isConnected){
                     this.setState({Processing: true})
                try {
                    axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/location/', {
                       city:addressName,
                       lat:lat,
                       lon:lon,
                       location_name:addressName,
                       area:area,
                       block_no: block_nu,
                       street_no: streetName,
                       building: building_nu
                       
                    },
                    { 
                      headers: {
                        'Authorization': 'Token '+this.props.User.token
                      }
                        }).then((response)=> {
                       this.setState({Processing: false})
                        if(response.data.detail){
                         if(this.props.Language=='AR'){
                            alert('تم أضافه العنوان بنجاح')
                          }else{
                            alert('Your Location Added Successfully')
                          }
                          this.setState({addressName:'' , area:'' , streetName:'' , block_nu:'' , building_nu:'' , floor_nu:'' , apt_no:''})
                        }
                           
                    }).catch((error)=> {
                     this.setState({Processing: false})
                       alert(error)
                       console.log(error.response.data.error)
                    }).finally(function () {
                        // always executed
                    });
                } catch (error) {
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
            }else{
                if(this.props.Language=='AR'){
                    alert('أدخل جميع البيانات')
                  }else{
                    alert('Enter All Data')
                  }
            }
         }else{
            if(this.props.Language=='AR'){
                alert('أذهب الي الخريطة لمعرفة الأحداثيات أولا')
              }else{
                alert('Go to Map First to Know latitude and Lonitude')
              }
         }
            
     } 
  

    renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity>
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'أضافة متجر جديد':'Add New Store'}</Text>
    
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
                    style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }} >
                    
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop:30,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    placeholder={this.props.Language=='AR'?'أسم العنوان':'Adress name'}
                                    defaultValue={this.state.addressName}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ email: text })}
                                />
                            </Item>
                        </View>
                        {/* <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed, { height:55,justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15 }]} >
                        <Icon name="angle-down" size={20} color="#707070" style={{margin:10,paddingHorizontal:10}} />
                       <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                          <ModalDropdown
                           options={this.state.areas} // data
                           defaultValue={this.props.Language == "AR"?'المنطقة / المحافظة':'Area / Governate'}
                           onSelect={(index, value) => { 
                             this.setState({ area: value.value , color:'#000' }) 
                           }}
                          renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                          style={{ width:'100%',}} // abl ma t5tar
                          textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 14, color: this.state.color,fontFamily:'nexa_bold',paddingHorizontal:'7%'}]}
                          dropdownStyle={[styles.shadow,{ width: '60%', height:140,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
                         renderRow={function (rowData, rowID, highlighted) {
                         return (
                           <View style={[ {width:'100%', backgroundColor: '#FCFCFC',justifyContent: 'center', alignItems: 'center', height: 35,}]}>
                         <Text style={[{ width:'100%',fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'nexa_bold',}, highlighted && { color: '#BDBDBD' }]}>
                          {rowData.label}
                         </Text>
                         </View>
                        );
                        }.bind(this)}
                       />
                     </View>  
                           
                        </View> */}
                         <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop:30,}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    placeholder={this.props.Language == "AR"?'المنطقة / المحافظة':'Area / Governate'}
                                    defaultValue={this.state.area}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ area: text })}
                                />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    placeholder={this.props.Language=='AR'?'أسم الشارع':'Street name'}
                                    defaultValue={this.state.streetName}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ streetName: text })}
                                />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15 }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder={this.props.Language=='AR'?'رقم القطاع':'Block no.'}
                                    defaultValue={this.state.block_nu}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ block_nu: text })} />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder={this.props.Language=='AR'?' رقم المبنـى':' Building no.'}
                                    defaultValue={this.state.building_nu}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ building_nu: text })}
                                />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15 }]} >
                            <Item style={[styles.inputFields,{}]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder={this.props.Language=='AR'?'رقم الطابق':'Floor no.'}
                                    defaultValue={this.state.floor_nu}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ floor_nu: text })} />
                            </Item>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' ,borderRadius:60,borderColor:'#707070',borderWidth:2,marginTop: 15}]} >
                            <Item style={[styles.inputFields,{  }]}>
                                <Input
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder={this.props.Language=='AR'?'رقم الشقة':'Apt no.'}
                                    defaultValue={this.state.apt_no}
                                    style={{ color: '#000' }} textAlign={this.props.Language=='AR'?'right':'left'}
                                    onChangeText={(text) => this.setState({ apt_no: text })}
                                />
                            </Item>
                        </View>
                       

                       

                       

                      
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: height*0.1 }]}>
                            <TouchableOpacity onPress={() => { alert('Done') }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' }]} >
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
export default connect(mapStateToProps, { })(AddNewStore)

const styles = StyleSheet.create({
    flex: {
        flex: 0
    },
    row: {
        flexDirection: 'row'
    },
    rowReversed:{
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
        height:55,
        borderBottomColor: '#F0F2F5',
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
    padRight:{
        marginStart:'40%'
    },
    padLeft:{
        paddingHorizontal:10
    },
    right:{
        textAlign:'right'
    },
    left:{
        textAlign:'left'
    }
});