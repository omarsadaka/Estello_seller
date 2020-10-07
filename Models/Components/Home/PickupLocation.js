import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, Image, AsyncStorage,ImageBackground,TextInput } from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions } from 'react-navigation-drawer'
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import MapView ,{Marker} from 'react-native-maps'
import Geocoder from 'react-native-geocoding';

import { connect } from 'react-redux' // redux
import { SetLoading } from '../../Actions' //redux

navigator.geolocation = require('@react-native-community/geolocation');
class DeliveryLocation extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           lastLat: null,
           lastLong: null,
          // markers: []        Change this
          marker: null ,        // to this
          location:[]  ,
          flag:1,   
        };
     }
     
     UNSAFE_componentWillMount(){
      }

      SendLocation = ( ) => {
         NetInfo.fetch().then(state =>{
             if (state.isConnected){
              this.props.SetLoading(true)
         try {
             axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/location/', {
               city:this.state.location[2],
	            lat:this.state.marker.latitude,
	            lon:this.state.marker.longitude,
	            location_name:this.state.location[3],
               area:this.state.location[1],
               block_no: 5,
	            street_no: this.state.location[0],
	            building: 8
	            
             },
             { 
               headers: {
                 'Authorization': 'Token '+this.props.User.token
               }
                 }).then((response)=> {
                this.props.SetLoading(false)
                 if(response.data.detail){
                    const loc={
                     lat:this.state.marker.latitude,
                     lon:this.state.marker.longitude, 
                    }
                    AsyncStorage.setItem('Location', JSON.stringify(loc))
                  if(this.props.Language=='AR'){
                     alert('تم أضافه المتجر بنجاح')
                   }else{
                     alert('Your Store Added Successfully')
                   }
                 }
                    
             }).catch((error)=> {
              this.props.SetLoading(false)
              if(error.response.data){
                 if(this.props.Language=='AR'){
                  alert('يوجد خطأ ما حاول مرة أخرى')
                 }else{
                  alert('Error happen try again')
                 }
                
              }else{
               alert(error)
              }
                
                console.log(error.response.data.error)
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

  onRegionChange(region, lastLat, lastLong) {
   this.setState({
     mapRegion: region,
     // If there are no new values set the current ones
     lastLat: lastLat || this.state.lastLat,
     lastLong: lastLong || this.state.lastLong
   });
 }

 componentWillUnmount() {
   navigator.geolocation.clearWatch(this.watchID);
 }

 renderHeader() {
   return (
      <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '10%', alignItems: 'center', backgroundColor: '#383B43',
       paddingHorizontal: 18 }]} >
        <View style={{justifyContent:'center',margin:5,}}>
         <TouchableOpacity>
        {/* <Icon name="shopping-cart" size={30} color="#FFCF01" style={{}} /> */}
        </TouchableOpacity>
        
        </View>
        <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'مكان التوصيل':'Delivery Location'}</Text>

        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
           <View style={{width:35,justifyContent:'center'}}>
            {this.props.Language=='AR'?
            <Icon name="angle-right" size={35} color="#fff" style={{}} />
            :
            <Icon name="angle-left" size={35} color="#fff" style={{}} />
            }
           </View>
        </TouchableOpacity>
      </View>
   )
}

    render(){
      const titleEN='Pinch in or out control the map zoom level, move the map and press to your exact location'
      const titleAR='يمكنك التحكم في مستوى تكبير الخريطة أو تصغيره وتحريك الخريطة والضغـط موقعك بالضبط'
        return(
         <View style={styles.container}>
         <StatusBar backgroundColor='#383B43' barStyle="light-content" />
         <Spinner
                 visible={this.state.Processing}
                 textContent={'Loading...'}
                 textStyle={{ color: '#FFF' }}
             />
         {this.renderHeader()}
       <View style={{width:width,height:'87%',alignItems:'center'}}>
       <MapView style={styles.map} 
          region={this.state.mapRegion}
           onPress={(e) =>{
               this.setState({ marker: e.nativeEvent.coordinate })
               const loc={
                  lat:e.nativeEvent.coordinate.latitude,
                  lon:e.nativeEvent.coordinate.longitude, 
                 }
               AsyncStorage.setItem('Location', JSON.stringify(loc))
               Geocoder.init("AIzaSyCcxpzOZVD-eo6ZHKhHUxoL3Yb0jxch8Do");
               Geocoder.from(e.nativeEvent.coordinate)
               .then(json => {
                     var addressComponent = json.results[0].address_components[0];
                     var formatted_address = json.results[0].formatted_address
                      console.log(addressComponent);
                      var ar = formatted_address.split(', ')
                      this.setState({location: ar})
                      console.log('dddddd'+ar)
                      })
                   .catch(error => console.warn(error));
                   

               }}
               showsUserLocation
               zoomControlEnabled
               zoomEnabled
               zoomTapEnabled
               minZoomLevel={3}
               mapType= "standard"
               // followUserLocation={true}
               // onRegionChange={this.onRegionChange.bind(this)}
               >
           {
           this.state.marker && 
           <Marker draggable
           coordinate={this.state.marker}
         // coordinate={{
         //    latitude: this.state.lastLat + 0.00050 ,
         //    longitude: this.state.lastLong + 0.00050 ,
         //  }}
           onDragEnd={(e) => this.setState({ marker: e.nativeEvent.coordinate })}/>
          } 
       </MapView>
         {this.state.flag==1?
         <View style={{width:'60%',alignItems:'center',justifyContent:'center',position:'absolute',bottom:'5%'}}>
               <Text style={{flex:1, textAlign:'center',color:'#FFFFFF',fontSize:40,fontFamily:'nexa_bold'}}>
                  { this.props.Language=='AR'?'أسـحب للألتقاط':'Drag to Pin'}
               </Text>
               <Text style={{flex:1, textAlign:'center',color:'#FFFFFF',fontSize:17,fontFamily:'nexa_light',marginTop:25}}>
                  { this.props.Language=='AR'?titleAR:titleEN}
               </Text>
               <TouchableOpacity onPress={() => {
                    this.setState({flag:2})
                   }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' ,marginTop:15}]} >
                    <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                         {this.props.Language == "AR" ? 'أبـدأ' : 'Got it'}
                      </Text>
               </TouchableOpacity>
         </View>
         :
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'80%',alignItems:'center',justifyContent:'center',position:'absolute',bottom:'5%'}]}>
             <TouchableOpacity onPress={() => {
                    AsyncStorage.removeItem('Location')
                   }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43' ,margin:10}]} >
                    <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                         {this.props.Language == "AR" ? 'تخــطى' : 'Skip'}
                      </Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => {
                    this.SendLocation()
                   }} style={[styles.Button, styles.shadow, { backgroundColor: '#383B43',margin:10 }]} >
                    <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                         {this.props.Language == "AR" ? 'تأكــيد' : 'Confirm'}
                      </Text>
               </TouchableOpacity>
         </View>
         }
             
         </View>
       </View>  
        )
    }
}
//redux
const mapStateToProps = state => {
    return {
       Language: state.LanguageReducer.Language,
       User: state.AuthReducer.User,
       Processing: state.AuthReducer.Processing,
       Message: state.AuthReducer.Message,
    }
 }
export default connect(mapStateToProps, { SetLoading })(DeliveryLocation)

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
     width:width,
     height:height,
      alignItems: 'center',
      backgroundColor: '#FFF',
   },
  Button: {
     width: '35%',
     borderRadius: 60,
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 10,
     marginBottom: 18,
     marginHorizontal: 36,
 },
 map: {
  ...StyleSheet.absoluteFillObject,
},
});
