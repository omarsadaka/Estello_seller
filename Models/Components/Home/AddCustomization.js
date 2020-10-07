import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import { Input, Item, List } from 'native-base'
import { DrawerActions } from 'react-navigation-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';

import { connect } from 'react-redux' // redux
import { SetLoading , getSellerProduct , getCategories , getDeals , addCustomization} from './../../Actions' //redux
const listArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
const list1 = [{ id: 1 ,nameAR:'تصنيـف',nameEN:'Categorize' }, 
 { id: 2,nameAR:'صفقات',nameEN:'Deals' } ,{ id: 3,nameAR:'منتجات',nameEN:'Products' }]
class AddCustomization extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           flag_view:1,
           bg1:'#383B43',
           bg2:'#FFCF06',
           txt1:'#FFCF06',
           txt2:'#383B43',
           flag_product: true,
           flag_deal: false,
           flag_filter: false,
           flag_category: false,
           id1:3,
           clicked: [],
           color1:'#0D0D0D',
           color2:'#0D0D0D',
           flag_img:1,
           deal_id: null,
           category_id: null,
           product_id: null,
           deal_title:'',
           deal_image:'',
           deal_desc: '',
           category_title:'',
           category_image:'',
           category_desc:'',
           style:'list_view',
           type:'product',
           list:[]
         
        };
     }
  
      UNSAFE_componentWillMount(){
         this.props.getSellerProduct(this.props.User.token)
         this.props.getCategories()
         this.props.getDeals(this.props.User.token)

      }
      
      componentWillReceiveProps(nextProps) {
         if (nextProps.Message != null) {
         if (nextProps.Message=='Successfully Added') {
             if(this.props.Language=='AR'){
                alert('تم الأضافة بنجاح')
             }else{
                alert('Successfully Added')
             }
         }else{
             alert(nextProps.Message)
         }
       }
     }
      
      renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity>
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'أضافة تخصيص':'Add Customization'}</Text>
     
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

     renderItemProduct(index ,item) {
       const {clicked , flag_view , list}= this.state
      return (
         <TouchableOpacity activeOpacity={1}
         onPress={() => {
            if(flag_view == 1){
               if(clicked.length>=10){
                 alert('10 product limit')
               }else{
                  clicked.push(item.name)
                  this.setState({flag_product: true})
                  const obj={
                     id: item.id
                  }
                  list.push(obj)
               }
               
            }else{
               if(clicked.length>=1){
                  alert('1 product limit')
                }else{
                   clicked.push(item.name)
                   this.setState({flag_product: true})
                   const obj={
                     id: item.id
                  }
                  list.push(obj)
                }
            }
           
         }}
          style={{flex:1,alignItems:'center',justifyContent: 'center',margin:4 }} >
               <View style={[styles.shadow,{width:130,height:height*0.25,alignItems:'center', justifyContent:'center',borderRadius:5 ,backgroundColor:clicked.includes(item.name)?'#FFCF01':'#fff'}]}>
                  <Image source={{uri: item.image}} resizeMode='stretch'
                  style={{ width: '100%', flex:1,}} />
                   
                 {clicked.includes(item.name)?
                  <View style={{width:25,height:25,borderRadius:25/2,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',position:'absolute',top:5,right:5}}>
                  <Feather name="check-circle" size={20} color="#000000"/>
                 </View>
                 :
                 <View style={{display:'none'}}></View>
                 }  

                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:11,color:'#707070',fontFamily:'nexa_light',marginTop:5}]}>
                   {item.name}</Text>
                   <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:9,color:'#707070',fontFamily:'nexa_light',marginTop:3,marginBottom:10}]}>
                   {item.price}  KWD</Text>

               </View>
         </TouchableOpacity>
      )
   }


     renderProduct(){
        return(
           <View style={{width:'100%',alignItems:'center'}}>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
                 {this.props.Language=='AR'? this.state.flag_view==1?'حد أقصي 1 منتج':'حد أقصي 10 منتجات':this.state.flag_view==1?'Limit : 10 Products':'Limit : 1 Products'}</Text> 
               <FlatList style={{width:'97%',marginTop:5,marginBottom:10}}
               data={this.props.Products}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               renderItem={({index , item }) => this.renderItemProduct(index , item)}
               keyExtractor={(item, index) => index.toString()}
             />
           </View>
        )
     }

     renderDeal(){
      return(
         <View style={{width:'100%',alignItems:'center'}}>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
               {this.props.Language=='AR'? this.state.flag_view==1?'حد أقصي 1 منتج':'حد أقصي 10 منتجات':this.state.flag_view==1?'Limit : 10 Products':'Limit : 1 Products'}</Text> 
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',justifyContent: 'center', alignItems: 'center',marginTop:10}]}>
             <Text style={{fontSize:16,textAlign:'center',color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'صفقـة':'Deal'}</Text>  
             <View style={{width:20}}></View>
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{flex:1,height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:30,borderWidth:0.3,borderColor:'#707070' }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.props.Deals} // data
                 defaultValue={this.props.Language == "AR"?' أختر الصفقة':'Select a Deal'}
                 onSelect={(index, value) => { 
                 this.setState({ deal_id: value.id , color1:'#000' }) 
                 this.setState({deal_title: value.title})
                 this.setState({deal_image: value.image})
                 this.setState({deal_desc: value.describtion})

                 const { list }= this.state
                 if(this.state.style=='one_view'){
                  if(list.length==0){
                     // list.push(value.id)
                     const obj={
                        id: value.id
                     }
                     list.push(obj)
                    }else{
                     if(this.props.Language=='AR'){
                        alert('صفقة واحد حد أقصى')
                     }else{
                        alert('one deal limit')
                     }
                    }
                 }else{
                  if(list.length>=10){
                     if(this.props.Language=='AR'){
                        alert(' 10 صفقـات حد أقصى ')
                     }else{
                        alert('10 deal limit')
                     }
                    }else{
                     // list.push(value.id)
                     const obj={
                        id: value.id
                     }
                     list.push(obj)
                    }
                 }
                
                 }}
                 renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 13,paddingHorizontal:'5%', color: this.state.color1,fontFamily:'nexa_bold'}]}
                 dropdownStyle={[styles.shadow,{ width: '60%', height:200,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
                 renderRow={function (rowData, rowID, highlighted) {
                 return (
                 <View style={[ {width:'100%', backgroundColor: '#FCFCFC',justifyContent: 'center', alignItems: 'center', height: 40,}]}>
                 <Text style={[{ width:'100%',fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'nexa_bold',}, highlighted && { color: '#BDBDBD' }]}>
                 {rowData.title}
                 </Text>
                 </View>
                );
                }.bind(this)}
               />
              </View>  
              <Icon name="angle-down" size={30} color="#707070" style={{margin:10,paddingHorizontal:10}} />
            </View>
             </View>

             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
              <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
              <View style={{width:20}}></View>
              <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
                  <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
                     <Input
                      defaultValue={this.state.deal_title}
                      style={{fontSize:14,height:50,textAlign:'center'}}
                       onChangeText={(text) => this.setState({ deal_title: text })} />
                  </Item>
               </View>
            </View>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'الوصــف':'Description'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.deal_desc}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:14,height:height*0.12,textAlignVertical:'top',marginHorizontal:20 }]}
                       onChangeText={(text) => this.setState({ deal_desc: text })} />
                  </Item>
               </View>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'صورة الصفقة':'Deal Image'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
                <TouchableOpacity
                 style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                 <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+this.state.deal_image}} style={{ width:'100%',height:'100%'}} resizeMode='cover' />
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity onPress={() => {
               // this.setState({flag_addSpecification:2})
               this.setState({deal_title:'' , deal_desc:'',deal_image:'',deal_id:null})
             }} 
              style={[styles.Button, styles.shadow, { width: '30%', backgroundColor: '#383B43',flexDirection:'row',marginTop:20 }]} >
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'أضافة المزيد' : 'Add More'}
              </Text>
            </TouchableOpacity>
         </View>
      )
   }
   renderFilter(){
      return(
         <View style={{width:'100%',alignItems:'center'}}>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
               {this.props.Language=='AR'? this.state.flag_view==1?'حد أقصي 1 منتج':'حد أقصي 10 منتجات':this.state.flag_view==1?'Limit : 10 Products':'Limit : 1 Products'}</Text> 
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',justifyContent: 'center', alignItems: 'center',marginTop:10}]}>
             <Text style={{fontSize:16,textAlign:'center',color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'فــرز':'Filter'}</Text>  
             <View style={{width:20}}></View>
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{flex:1,height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:30,borderWidth:0.3,borderColor:'#707070' }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.state.deals} // data
                 defaultValue={this.props.Language == "AR"?' أختر الفرز':'Select a Filter'}
                 onSelect={(index, value) => { 
                 this.setState({ deal: value.label , color:'#000' }) 
                 }}
                 renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 13,paddingHorizontal:'5%', color: this.state.color,fontFamily:'nexa_bold'}]}
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
              <Icon name="angle-down" size={30} color="#707070" style={{margin:10,paddingHorizontal:10}} />
            </View>
             </View>

             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
              <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
              <View style={{width:20}}></View>
              <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
                  <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
                     <Input
                      defaultValue={this.state.title}
                      style={{fontSize:14,height:50,textAlign:'center'}}
                       onChangeText={(text) => this.setState({ title: text })} />
                  </Item>
               </View>
            </View>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'الوصــف':'Description'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.description}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:14,height:height*0.12,textAlignVertical:'top',marginHorizontal:10 }]}
                       onChangeText={(text) => this.setState({ description: text })} />
                  </Item>
               </View>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'صورة الفـرز':'Filter Image'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
                <TouchableOpacity
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>

                </TouchableOpacity>
               
            </View>
            <TouchableOpacity onPress={() => {this.setState({flag_addSpecification:2}) }} 
              style={[styles.Button, styles.shadow, { width: '30%', backgroundColor: '#383B43',flexDirection:'row',marginTop:20 }]} >
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'أضافة المزيد' : 'Add More'}
              </Text>
            </TouchableOpacity>
         </View>
      )
   }

   renderCategory(){
      return(
         <View style={{width:'100%',alignItems:'center'}}>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:12,color:'#707070',fontFamily:'nexa_light',marginTop:10}]}>
               {this.props.Language=='AR'? this.state.flag_view==1?'حد أقصي 1 منتج':'حد أقصي 10 منتجات':this.state.flag_view==1?'Limit : 10 Products':'Limit : 1 Products'}</Text> 
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',justifyContent: 'center', alignItems: 'center',marginTop:10}]}>
             <Text style={{fontSize:16,textAlign:'center',color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'الفـئة':'Category'}</Text>  
             <View style={{width:20}}></View>
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{flex:1,height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:30,borderWidth:0.3,borderColor:'#707070' }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.props.Categories} // data
                 defaultValue={this.props.Language == "AR"?' أختر الفئـة':'Select a Category'}
                 onSelect={(index, value) => { 
                 this.setState({ category_id: value.id , color2:'#000' }) 
                 this.setState({category_title: value.name})
                 this.setState({category_image: value.image})
                 this.setState({category_desc: value.describtion})

                 const { list }= this.state
                 if(this.state.style=='one_view'){
                  if(list.length==0){
                     // list.push(value.id)
                     const obj={
                        id: value.id
                     }
                     list.push(obj)
                    }else{
                     if(this.props.Language=='AR'){
                        alert('فـئة واحد حد أقصى')
                     }else{
                        alert('one category limit')
                     }
                    }
                 }else{
                  if(list.length>=10){
                     if(this.props.Language=='AR'){
                        alert(' 10 فـئات حد أقصى ')
                     }else{
                        alert('10 category limit')
                     }
                    }else{
                     // list.push(value.id)
                     const obj={
                        id: value.id
                     }
                     list.push(obj)
                    }
                 }
                 }}
                 renderButtonText={(rowData) => (rowData.name)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 13,paddingHorizontal:'5%', color: this.state.color2,fontFamily:'nexa_bold'}]}
                 dropdownStyle={[styles.shadow,{ width: '60%', height:200,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
                 renderRow={function (rowData, rowID, highlighted) {
                 return (
                 <View style={[ {width:'100%', backgroundColor: '#FCFCFC',justifyContent: 'center', alignItems: 'center', height: 40,}]}>
                 <Text style={[{ width:'100%',fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'nexa_bold',}, highlighted && { color: '#BDBDBD' }]}>
                 {rowData.name}
                 </Text>
                 </View>
                );
                }.bind(this)}
               />
              </View>  
              <Icon name="angle-down" size={30} color="#707070" style={{margin:10,paddingHorizontal:10}} />
            </View>
             </View>

             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
              <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
              <View style={{width:20}}></View>
              <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
                  <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
                     <Input
                      defaultValue={this.state.category_title}
                      style={{fontSize:14,height:50,textAlign:'center'}}
                       onChangeText={(text) => this.setState({ category_title: text })} />
                  </Item>
               </View>
            </View>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'الوصــف':'Description'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.category_desc}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:14,height:height*0.12,textAlignVertical:'top',marginHorizontal:20 }]}
                       onChangeText={(text) => this.setState({ category_desc: text })} />
                  </Item>
               </View>
               <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'صورة الفئـة':'Category Image'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
                <TouchableOpacity
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                  <Image source={{uri: 'http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com'+this.state.category_image}} style={{ width:'100%',height:'100%'}} resizeMode='cover' />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {
               // this.setState({flag_addSpecification:2}) 
               this.setState({category_title:'',category_desc:'',category_image:'',category_id:null})
            }} 
              style={[styles.Button, styles.shadow, { width: '30%', backgroundColor: '#383B43',flexDirection:'row',marginTop:20 }]} >
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'أضافة المزيد' : 'Add More'}
              </Text>
            </TouchableOpacity>
         </View>
      )
   }
     
     renderButton1(item,index){
      const { id1 }= this.state
      return(
         <TouchableOpacity onPress={() => { 
            this.setState({id1: item.id})
            this.setState({list:[]})
             if(item.id == 1){
                this.setState({flag_category: true , flag_deal: false , flag_product: false})
                this.setState({type:'category'})
             }else if(item.id ==2){
               this.setState({flag_category: false , flag_deal: true , flag_product: false})
               this.setState({type:'deal'})
             }else if(item.id==3){
               this.setState({flag_category: false , flag_deal: false , flag_product: true})
               this.setState({type:'product'})
             }
          }} 
         style={[styles.shadow, {  flex:1,borderRadius: 60,alignItems: 'center',justifyContent: 'center',backgroundColor:item.id==id1?'#383B43':'#FFCF06',margin:5}]} >
         <Text style={{ color: item.id==id1?'#FFCF01':'#212121', fontSize: 14,fontFamily:'nexa_bold',padding:6 }}>
              {this.props.Language == "AR" ? item.nameAR : item.nameEN}
         </Text>
       </TouchableOpacity>
      )
  }

     renderItemStore(index) {
      return (
         
               <View style={[styles.shadow,{flex:1,alignItems:'center', justifyContent:'center',borderRadius:8 ,backgroundColor:'#fff',margin:5}]}>
                  <Image source={require('./../../../image/store_img.png')} resizeMode='cover'
                   style={{ width: '90%', height:100,marginTop:15}} />
                   
                  <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#6E7177',fontFamily:'nexa_bold',marginTop:5}]}>
                   Mens Fashion Ware</Text>
                   <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:13,color:'#6E7177',fontFamily:'nexa_light',marginTop:2,marginBottom:5}]}>
                   Lorem ipsum dolor sit amet</Text>
   
               </View>
      )
   }
     renderListView(){
        return(
          <View style={{width:width,alignItems:'center',justifyContent:'center'}}>
             <View style={{width:'100%',height:height*0.15,backgroundColor:'#383B43',marginTop:10}}>
            </View>

           <FlatList style={{width:'100%',position:'absolute',top:height*0.05,}}
               data={listArr}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               renderItem={({ item }) => this.renderItemStore(item)}
               keyExtractor={(item, index) => index.toString()}
             />
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'85%',fontSize:15,color:'#21212170',fontFamily:'nexa_bold',marginTop:height*0.1}]}>
                 {this.props.Language=='AR'?'أختر ما يظهـر':'Choose What is Shown'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
               {
                  list1.map((item, index) => {
                     return this.renderButton1(item ,index)
                  })
               }
            </View>
            {this.state.flag_product?
               this.renderProduct()
             :
              this.state.flag_deal? this.renderDeal()
              :
              this.state.flag_filter? this.renderFilter(): this.renderCategory()
             }
          </View>
        )
     }
     renderOneView(){
        return(
          <View style={{width:width,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity 
         // onPress={() => this.props.navigation.navigate('Products')} 
          style={[styles.row, { justifyContent: 'center', marginTop: 15, }]} >
            <View style={[styles.flex, styles.row, { width: width - (10 * 2), height: height/4, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFF' }]}>
            <ImageBackground
             resizeMode ="cover"
             source={require('./../../../image/store_img.png')}
             style={{  width: width, height: '100%', alignItems: 'center', borderRadius:15}} />
            <LinearGradient colors={['#1E1E1E','#35353569']} style={styles.linearGradient}/>
            <Text style={[this.props.Language=='AR'?styles.posRight:styles.posLeft,{width:'90%',fontSize:20,color:'#FFF',position: 'absolute',bottom:'15%',fontFamily:'nexa_bold'}]}>
               Deals on Mens clothes</Text>
            <Text style={[this.props.Language=='AR'?styles.posRight:styles.posLeft,{width:'90%',fontSize:13,color:'#FFF',position: 'absolute',bottom:'7%',fontFamily:'nexa_light'}]}>
               write here the description of item</Text>
            </View>
         </TouchableOpacity>
              <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'85%',fontSize:15,color:'#21212170',fontFamily:'nexa_bold',marginTop:20}]}>
                 {this.props.Language=='AR'?'أختر ما يظهـر':'Choose What is Shown'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
               {
                  list1.map((item, index) => {
                     return this.renderButton1(item ,index)
                  })
               }
            </View>
            {this.state.flag_product?
               this.renderProduct()
             :
              this.state.flag_deal? this.renderDeal()
              :
              this.state.flag_filter? this.renderFilter(): this.renderCategory()
             }
          </View>
        )
     }
    render(){
        return(
            <View style={styles.container}>
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            <Spinner
             visible={this.props.Processing}
             textContent={'Loading...'}
             textStyle={{ color: '#FFF'}}/>
            {this.renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
            <View style={{width:width , alignItems:'center',justifyContent:'center'}}>
            <Text style={{width:'90%',textAlign:'center',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}}>{this.props.Language=='AR'?'أضافة تخصيص':'Add Customization'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:15}]}>
             <TouchableOpacity 
               onPress={() => {
                  this.setState({bg1:'#383B43' , bg2:'#FFCF06'})
                  this.setState({txt1:'#FFCF06' , txt2:'#383B43'})
                  this.setState({flag_view:1 , clicked: []})
                  this.setState({style:'list_view'})
               }} 
               style={[styles.Button, styles.shadow, { width: '30%', backgroundColor: this.state.bg1,flexDirection:'row' }]} >
              <Text style={{ color: this.state.txt1, fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'عرض قائمه' : 'List View'}
              </Text>
            </TouchableOpacity>
            <View style={{flex:1}}></View>
            <TouchableOpacity 
               onPress={() => {
                  this.setState({bg2:'#383B43' , bg1:'#FFCF06'})
                  this.setState({txt2:'#FFCF06' , txt1:'#383B43'})
                  this.setState({flag_view:2 , clicked: []})
                  this.setState({style:'one_view'})
               }} 
               style={[styles.Button, styles.shadow, { width: '30%', backgroundColor: this.state.bg2,flexDirection:'row' }]} >
              <Text style={{ color: this.state.txt2, fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'عنصر واحد' : 'One View'}
              </Text>
            </TouchableOpacity>
            </View>
             
             {this.state.flag_view==1?
              this.renderListView()
             :
              this.renderOneView()
             }

            <TouchableOpacity onPress={() => {
               alert(JSON.stringify(this.state.list)) 
               const { style , type , list }= this.state
               this.props.addCustomization(this.props.User.token , style , type , list)
            }} 
              style={[styles.Button, styles.shadow, { width: '90%', backgroundColor: '#383B43',flexDirection:'row',marginTop:20,paddingVertical:10 }]} >
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'تنفيــذ' : 'Submit'}
              </Text>
            </TouchableOpacity>
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
       Products: state.AuthReducer.Products,
       Categories: state.AuthReducer.Categories,
       Deals: state.AuthReducer.Deals
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , getSellerProduct ,getCategories , getDeals , addCustomization})(AddCustomization)
 
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
       elevation: 3,
    },
    container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#F0F2F5',
    },
   inputFields: {
    width:'90%',
    color: '#424242',
    backgroundColor:'#fff',
    borderRadius:40,
    marginTop:10,
 },
 right:{
     textAlign:'right'
 },
 left:{
     textAlign:'left'
 },
 Button: {
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    marginBottom: 10,
    marginHorizontal: 36
},
posLeft:{
   left:10
},
posRight:{
   right:10
}
 });