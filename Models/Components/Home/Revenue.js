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
import {
   LineChart,
   BarChart,
   PieChart,
   ProgressChart,
   ContributionGraph,
   StackedBarChart
 } from "react-native-chart-kit";

import { connect } from 'react-redux' // redux
import { SetLoading , getRevenue} from './../../Actions' //redux



 const chartConfig = {
   backgroundGradientFrom: "#1E2923",
   backgroundGradientFromOpacity: 0,
   backgroundGradientTo: "#08130D",
   backgroundGradientToOpacity: 0.5,
   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   strokeWidth: 2, // optional, default 3
   barPercentage: 0.5,
   useShadowColorFromDataset: false // optional
 };
 const listFilter = [{ id: 4 , name:'Jeans' }, { id: 5 , name:'Pants' }, { id: 6 , name:'Shirts'},
 { id: 7 , name:'T-Shirts' }, { id: 8 , name:'Shoes'}, { id: 9 , name:'SportsWear'}]

class Revenue extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           scrollX: new Animated.Value(0),
           id: null,
           flag_view:1,
           flag_filter:1,
           flag_filter:1,
           radioSelected: null,
           products:[],
           date:{},
           cat:'',
           sub_cat:''
        };
     }

     UNSAFE_componentWillMount(){
        this.props.getRevenue(this.props.User.token)
        this.getProduct(this.props.User.token)
     }

     getProduct = () => {
      const { navigation } = this.props;
      const id = navigation.getParam('ID', 'NO-ID');
            NetInfo.fetch().then(state =>{
               if (state.isConnected){
             try {
                 axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/revenue_detail/',{
                  headers: {
                     'Authorization': 'Token '+this.props.User.token
                   },
                 })
                 .then((response)=> {
                  
                  var Data = response.data.products
                  // const data = {
                  //     week1_revenue: response.data.week1_revenue,
                  //     week2_revenue: response.data.week2_revenue,
                  //     week3_revenue: response.data.week3_revenue,
                  //     week4_revenue: response.data.week4_revenue,
                  //     total_revenue: response.data.total_revenue,
                  // }
                  if(Data.length==0){
                      alert('No Products Now')
                  }
                   this.setState({products:Data})
                 }).catch((error)=> {
                  
                  if(error.response.data.detail){
                     alert(error.response.data.detail)
                  }else{
                     alert(error)
                  }
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
     }

     getProductFilter = () => {
      const { navigation } = this.props;
      const id = navigation.getParam('ID', 'NO-ID');
      const { cat , sub_cat }= this.state
      if(cat){
         if(sub_cat){
            NetInfo.fetch().then(state =>{
               if (state.isConnected){
             try {
                 this.setState({Processing: true})
                 axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_seller_profile/1/',{
                  headers: {
                     'Authorization': 'Token '+this.props.User.token
                   },
                   params:{
                     name__startswith: this.state.sub_cat ,
                     sex: this.state.cat
                   }
                 })
                 .then((response)=> {
                  this.setState({Processing: false})
                     const Data = response.data.products;
                     const store = response.data.store
                      this.setState({store})
                      const products = []
                      for (let index = 0; index < Data.length; index++) {
                     var obj = {
                         id: Data[index].id,
                         name: Data[index].name,
                         price: Data[index].price,
                         image: Data[index].image,
                         favourite: Data[index].favourite
                     }
                     products.push(obj)
                 }
                   this.setState({products})
                   if(products.length==0){
                      alert('No Filter Data')
                   }
                   if(this.state.flag_filter==1){
                     this.setState({flag_filter:2})
                    }else{
                     this.setState({flag_filter:1})
                    }
                 }).catch((error)=> {
                  this.setState({Processing: false})
                  if(error.response.data.detail){
                     alert(error.response.data.detail)
                  }else{
                     alert(error)
                  }
                 }).finally(function () {
                     // always executed
                 });
             } catch (error) {
               this.setState({Processing: false})
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
            alert('Enter SubCategory First')
         }

      }else{
         alert('Enter Category First')
      }
}

     renderRadio(clicked){
      return(
       <TouchableOpacity
       style={{width:20,height:20,borderRadius:20/2,borderColor:'#fff',borderWidth:1,margin:3,justifyContent:'center',alignItems:'center'}}
       onPress={()=>{
          this.setState({radioSelected:clicked})
          if(clicked==1){
             this.setState({cat: 'men'})
          }else if(clicked==2){
            this.setState({cat: 'women'})
          }else{
            this.setState({cat: 'kids'})
          }
       }}>
         {this.state.radioSelected === clicked?
         <View  style={{width:15 ,height:15 ,borderRadius:15/2,backgroundColor:'#FFCF01'}}></View>
         :
         <View style={{display:'none'}}></View>
         }
       </TouchableOpacity>
      )
    }

     renderFilter(item){
        return(
           <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'80%',alignItems:'center',marginBottom:'3%'}]}>
            <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{item.name}</Text>
            <TouchableOpacity
             style={{width:20,height:20,borderRadius:20/2,borderColor:'#fff',borderWidth:1,margin:3,justifyContent:'center',alignItems:'center'}}
             onPress={()=>{
               this.setState({radioSelected2:item.id})
               this.setState({sub_cat: item.name.toLowerCase()})
             }}>
              {this.state.radioSelected2 === item.id?
              <View  style={{width:15 ,height:15 ,borderRadius:15/2,backgroundColor:'#FFCF01'}}></View>
             :
             <View style={{display:'none'}}></View>
             }
            </TouchableOpacity>
           </View>
        )
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
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'الأيرادات':'Revenue'}</Text>
     
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

     renderItem(index,item) {
        return (
           <TouchableOpacity activeOpacity={1}
           // onPress={() => this.props.navigation.navigate('ProjectInfo')} 
           key={index.toString()} style={[ { justifyContent: 'center',margin:4 }]} >
                 <View style={[styles.shadow,this.props.Language=='AR'?styles.rowReversed:styles.row,{ width: '100%', height: height*0.11,alignItems:'center', borderRadius:10 ,backgroundColor:'#fff'}]}>
                    <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+item.image}}
                    style={{ width: 80, height: '90%', borderRadius:8,marginHorizontal:5}} />
                    <View style={{flex:1,height:'99%',justifyContent:'center'}}>
                    <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:13,color:'#212121',fontFamily:'nexa_bold',}]}>
                     {item.name}</Text>
                     {this.props.Language=='AR'?
                       <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
                      المقاس : {item.size}</Text>
                     :
                     <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
                     Size: {item.size}</Text>
                     }
                   
                     <Text style={[this.props.Language=='AR'?styles.right:styles.left,{fontSize:11,color:'#707070',fontFamily:'nexa_light',}]}>
                     Color: {item.color}</Text>
                    
                    </View>
  
                    <View style={{width:100,height:'99%'}}>
                    <Text style={[this.props.Language=='AR'?styles.posRight:styles.posLeft,{fontSize:11,color:'#707070',fontFamily:'nexa_light',position:'absolute',bottom:30}]}>
                     Price: {item.price} KWD</Text>
                     <Text style={[this.props.Language=='AR'?styles.posRight:styles.posLeft,{fontSize:11,color:'#707070',fontFamily:'nexa_light',position:'absolute',bottom:10}]}>
                     Quantity: {item.quantity}</Text>
                    </View>
                    
                 </View>
           </TouchableOpacity>
        )
     }

    render(){

      const data = {
         labels: ["1 W", "2 W", "3 W", "4 W"],
         datasets: [
           {
             data: [this.props.RevenueData.week1_revenue?this.props.RevenueData.week1_revenue:0,
               this.props.RevenueData.week2_revenue?this.props.RevenueData.week2_revenue:0,
               this.props.RevenueData.week3_revenue?this.props.RevenueData.week3_revenue:0, 
               this.props.RevenueData.week4_revenue?this.props.RevenueData.week4_revenue:0],
             color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
             strokeWidth: 2 // optional
           }
         ],
       };

        return(
            <View style={styles.container} >
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
            { this.state.flag_filter==1?
             this.renderHeader()
            :
            <View style={{display:'none'}}></View>
            }
             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
             <View style={{width:width , alignItems:'center',justifyContent:'center'}}>
             <View style={{width:'97%',alignItems:'center',justifyContent:'center',marginTop:7,backgroundColor:'#FFCF01',borderRadius:10,height:65}}>
               <Text style={{ textAlignVertical:'center',color: '#212121', fontSize: 21,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'الايرادات':'Revenue'}</Text>
               <Text style={[this.props.Language=='AR'?styles.posLeft:styles.posRight,{color: '#212121', fontSize: 27,fontFamily:'nexa_bold',position:'absolute'}]}>
                 0 {/* {this.props.ProductRevenue.length == 0? 0 :this.props.ProductRevenue.length} */}
               </Text>
               </View>
               <View style={{width:'90%' ,alignItems:'center',justifyContent:'center',marginTop:15}}>
               <LineChart
               data={data}
               width={width*0.9}
               height={height*0.3}
               verticalLabelRotation={30}
               chartConfig={chartConfig}
               bezier
               />
                {this.props.Language=='AR'?
                <Text style={{color: '#212121', fontSize: 18,fontFamily:'nexa_light',position:'absolute',top:'10%'}}>
               الأجمالي: {this.props.RevenueData.total_revenue}</Text>
                :
                <Text style={{color: '#212121', fontSize: 18,fontFamily:'nexa_light',position:'absolute',top:'10%'}}>
                  Total: {this.props.RevenueData.total_revenue}</Text>
                }
               
              </View>
               {/* <Image source={require('./../../../image/card.png')} 
               style={{ width:'93%',height:height*0.3 ,marginTop:10}} resizeMode='stretch' /> */}
               
               <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center',justifyContent:'center',marginTop:20}]}>
               <Text style={{flex:1, color: '#212121', fontSize: 13,fontFamily:'nexa_bold',textAlign:'center'}}>{this.props.Language=='AR'?'المشتريات':'Purchasess'}</Text>
               <TouchableOpacity 
               style={{width:80,borderRadius:20,backgroundColor:'#383B44',alignItems:'center',justifyContent:'center',padding:5}}>
               <Text style={{color:'#FFCF01',fontSize:12,fontFamily:'nexa_bold',textAlign:'center'}}>Get Excel</Text>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={() => {
                  if(this.state.flag_filter==1){
                   this.setState({flag_filter:2})
                }else{
                   this.setState({flag_filter:1})
                }
               }}
               style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
               <Text style={{ color: '#383B43', fontSize:13,fontFamily:'nexa_bold',paddingHorizontal:5}}>{this.props.Language=='AR'?'تصنيف':'Filter'}</Text>
               <Image source={require('./../../../image/sort.png')} style={{ width:20,height:15}}/>
               </TouchableOpacity>
               </View>

               <FlatList style={{ width: '90%',marginTop:30,marginBottom:5}}
                data={this.state.products}
                showsVerticalScrollIndicator={false}
                renderItem={({index, item }) => this.renderItem(index,item)}
                keyExtractor={(item, index) => index.toString()}
              />

                {this.state.flag_filter!=1?
                <View style={styles.filterSection}>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:10,marginTop:15}]}>
                    <Text style={{flex:1,color:'#FFCF01',fontSize:20,fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'تصنيف حسب':'Filter By'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(1)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'رجالى':'Men'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter]}>
                      {this.renderRadio(2)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'حريمى':'Women'}</Text>
                 </View>
                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:'3%'}]}>
                      {this.renderRadio(3)}
                      <Text style={{flex:1 , color:'#FFFFFF',fontSize:15,fontFamily:'nexa_light'}}>{this.props.Language=='AR'?'أطفالى':'Kids'}</Text>
                 </View>
                 <View style={{width:"90%",height:1,backgroundColor:'#707070'}}></View>

               <View style={[styles.searchSection,{ height:40}]}>
               <TextInput
                   style={styles.input}
                   placeholder="Search filter"
                   placeholderTextColor='#000'
                   onChangeText={(searchString) => {this.setState({searchString})}}
                   underlineColorAndroid="transparent"
               />
               </View>
                
                 <View style={{width:"90%",height:1,backgroundColor:'#707070',marginTop:'3%',marginBottom:'3%'}}></View>
                 
                  {
                  listFilter.map((item) => {
                     return this.renderFilter(item)
                  })
                 }


                 <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.viewFilter,{marginBottom:10}]}>
                     <TouchableOpacity 
                       onPress={()=> {
                          this.getProductFilter()
                        }}
                       style={{flex:1 ,alignItems:'center',justifyContent:'center',borderRadius:60,borderColor:'#fff',borderWidth:1}}>
                       <Text style={{textAlignVertical:'center',color:'#FFFFFF',fontSize:18,fontFamily:'nexa_bold',paddingVertical:10}}>{this.props.Language=='AR'?'تنفيذ':'Apply'}</Text>
                     </TouchableOpacity>
                      <View style={{width:'10%'}}></View>
                     <TouchableOpacity 
                       onPress={() => {
                          this.setState({radioSelected: null})
                        if(this.state.flag_filter==1){
                         this.setState({flag_filter:2})
                       }else{
                         this.setState({flag_filter:1})
                       }
                      }}
                     style={{flex:1 ,alignItems:'center',justifyContent:'center',borderRadius:60,borderColor:'#fff',borderWidth:1}}>
                       <Text style={{textAlignVertical:'center', color:'#FFFFFF',fontSize:18,fontFamily:'nexa_bold',paddingVertical:10}}>{this.props.Language=='AR'?'مسـح':'Clear'}</Text>
                     </TouchableOpacity>
                </View>


               </View>
               :
               <View style={{display:'none'}}></View>
               }

             </View>
             </ScrollView>
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
       ProductRevenue: state.AuthReducer.ProductRevenue,
       RevenueData: state.AuthReducer.RevenueData
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , getRevenue})(Revenue)
 
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
       alignItems: 'center',
       backgroundColor: '#F0F2F5',
    },
    posRight:{
        right:15
    },
    posLeft:{
        left:15
    },
    viewFilter:{
      width:'80%',height:40,
      alignItems:'center',justifyContent:'center'
   },
   searchSection: {
      width:'85%',
      borderRadius:60,
      borderColor:'#707070',
      borderWidth:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginTop:10,
      backgroundColor:'#FFFFFF'
   },
   filterSection:{
      width:width,
      backgroundColor:'#383B43',
      alignItems:'center',
      position:'absolute',top:0
   },
   input: {
      flex:1,
      color: '#000',
   },
 });