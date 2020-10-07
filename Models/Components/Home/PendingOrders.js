import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList } from 'react-native';
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
import { SetLoading , getPendingOrders } from './../../Actions' //redux

const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]


class PendingOrders extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           scrollX: new Animated.Value(0),
           id: null,
           flag_view:1,
           flag_filter:1,
           radioSelected: null,
        };
     }

     UNSAFE_componentWillMount(){
        this.props.getPendingOrders(this.props.User.token)
     }

     renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity
              onPress={()=>alert('Search')}>
             <Icon name="search" size={27} color="#fff" style={{}} />
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'الرئيسية':'Home'}</Text>
     
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

     renderItem(index ,item) {
        return (
           <TouchableOpacity activeOpacity={1}
           onPress={() => this.props.navigation.navigate('OrderDetails',{ID: item.id})} 
           key={index.toString()} style={[ { justifyContent: 'center',margin:4 }]} >
                 <View style={[styles.shadow,{ width: '100%', height: height*0.13,alignItems:'center', borderRadius:10 ,backgroundColor:'#fff',padding:7}]}>
                    <View style={{width:'95%',justifyContent:'center',marginTop:10}}>
                    <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:13,color:'#212121',fontFamily:'nexa_bold'}]}>
                     {item.customer_name}</Text>
                     <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{alignItems:'center',marginTop:3}]}>
                     <Icon name="phone" size={20} color="#FFCF01" style={{}} />
                     <Text style={{fontSize:10,textAlign:'center',color:'#707070',fontFamily:'nexa_light',paddingHorizontal:5}}>
                      {item.customer_phone}</Text>
                     </View>
                     
                    </View>
                     <View style={{width:'90%',height:1,backgroundColor:'#70707025',marginTop:5}}></View>
                    <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'95%',position:'absolute',bottom:15}]}>
                    <Text style={[this.props.Language=='AR'?styles.right:styles.left,{flex:1,fontSize:12,color:'#21212150',fontFamily:'nexa_bold'}]}>
                     {item.orderID}</Text>
                     <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{alignItems:'center',justifyContent:'center'}]}>
                     <Text style={{fontSize:13,textAlign:'center',color:'#212121',fontFamily:'nexa_bold',paddingHorizontal:5}}>
                      {this.props.Language=='AR'?'تفاصيل الطلب':'Order Details'}</Text>
                      {this.props.Language=='AR'?
                        <Icon name="angle-double-left" size={20} color="#70707070" style={{}}/>
                      :
                       <Icon name="angle-double-right" size={20} color="#70707070" style={{}}/>
                      }
                     </View>
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
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
             {this.renderHeader()}
             {/* <View style={{width:width , alignItems:'center',justifyContent:'center'}}> */}
               <View style={{width:'97%',alignItems:'center',justifyContent:'center',marginTop:7,backgroundColor:'#FFCF01',borderRadius:10,height:70}}>
               <Text style={{ textAlignVertical:'center',color: '#212121', fontSize: 21,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'الطلبات المعلقة':'Pending Orders'}</Text>
               <Text style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{color: '#212121', fontSize: 27,fontFamily:'nexa_bold',position:'absolute'}]}>
                {this.props.PendingOrders.lenght}</Text>
               </View>
               <FlatList style={{ width: '90%',marginTop:30,marginBottom:5}}
                data={this.props.PendingOrders}
                showsVerticalScrollIndicator={false}
                renderItem={({index, item }) => this.renderItem(index,item)}
                keyExtractor={(item, index) => index.toString()}
              />
             {/* </View> */}
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
       PendingOrders: state.AuthReducer.PendingOrders
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , getPendingOrders })(PendingOrders)
 
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