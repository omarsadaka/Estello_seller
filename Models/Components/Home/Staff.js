import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList, AsyncStorage } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import { DrawerActions } from 'react-navigation-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';

import { connect } from 'react-redux' // redux
import { SetLoading , getStaff } from './../../Actions' //redux

const list = [{ id: 1 }, { id: 2 }, { id: 3 }]

class Staff extends Component{

    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           
        };
     }

     UNSAFE_componentWillMount(){
        this.props.getStaff(this.props.User.token)
     }
     renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity
              style={{width:35,height:35,borderRadius:35/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center'}}
              onPress={()=> this.props.navigation.navigate('AddStaff')}>
             <Icon name="plus" size={20} color="#212121" style={{}} />
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'العاملين':'Staff'}</Text>
     
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

     renderItem(index ,item) {
        return (
           <TouchableOpacity activeOpacity={1}
           onPress={() => {
              const obj={
                 id: item.id,
                 name: item.name,
                 email: item.email,
                 phone: item.phone,
                 authorization: item.authorization
              }
              AsyncStorage.setItem('StaffData' , JSON.stringify(obj))
              this.props.navigation.navigate('StaffView')
            }} 
           key={index.toString()} style={[ { justifyContent: 'center',margin:4 }]} >
                 <View style={[styles.shadow,{ width: '100%', height: height*0.13,alignItems:'center',justifyContent:'center', borderRadius:10 ,backgroundColor:'#fff'}]}>
                    <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#FFCF01',fontFamily:'nexa_bold'}]}>
                     {item.name}</Text>
                     <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:5}]}>
                      Status: {item.status}</Text>
                     
                     <View style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{width:30,alignItems:'center',justifyContent:'center',position:'absolute'}]}>
                      {this.props.Language=='AR'?
                        <Icon name="angle-left" size={20} color="#70707070" style={{}}/>
                      :
                       <Icon name="angle-right" size={20} color="#70707070" style={{}}/>
                      }
                     </View>
                      
                    
                 </View>
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
              
               <FlatList style={{ width: '90%',marginTop:30,marginBottom:5}}
                data={this.props.Staff}
                showsVerticalScrollIndicator={false}
                renderItem={({index, item }) => this.renderItem(index,item)}
                keyExtractor={(item, index) => index.toString()}
              />
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
       Staff: state.AuthReducer.Staff
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , getStaff })(Staff)
 
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
    posRight:{
        right:15
    },
    posLeft:{
        left:15
    }
 });