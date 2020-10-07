import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Animated, StatusBar, TextInput,Image, ScrollView,ImageBackground,FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import { Input, Item } from 'native-base'
import { DrawerActions } from 'react-navigation-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import ImgToBase64 from 'react-native-image-base64';


import { connect } from 'react-redux' // redux
import { SetLoading , getStoreLocations , getCategories , getSubCategories , addProduct} from './../../Actions' //redux

const list1 = [{ id: 1 ,nameAR:'خانة اختيار',nameEN:'Checkbox' }, 
{ id: 2,nameAR:'إدخال',nameEN:'Input' },
 { id: 3,nameAR:'مذياع',nameEN:'Radio' }]
 const list2 = [{ id: 1 ,nameAR:'خانة اختيار',nameEN:'Checkbox' }, 
{ id: 2,nameAR:'إدخال',nameEN:'Input' },
 { id: 3,nameAR:'مذياع',nameEN:'Radio' }]
 const listSize1 = [{ id: 1 , name: 'L' }, { id: 2 , name: 'XL' }, { id: 3 , name: 'M' }, { id: 4 , name: 'S' },{ id: 5 , name: 'M' }]
 const listSizeCheck1 = [{ id: 1 , name: 'M' }, { id: 2 , name: 'S' }]
 const listColor1 = [{ id: 1 , name: 'Red' }, { id: 2 ,name: 'Green'}, { id: 3 ,name: 'White' }, { id: 4 ,name: 'Blue' }]

 const listSize2 = [{ id: 1 , name: 'L' }, { id: 2 , name: 'XL' }, { id: 3 , name: 'M' }, { id: 4 , name: 'S' },{ id: 5 , name: 'M' }]
 const listSizeCheck2 = [{ id: 1 , name: 'M' }, { id: 2 , name: 'S' }]


class AddProduct extends Component{
    constructor(props) {
        super(props);
        this.state = {
           Processing:false,
           flag_img:1,
           flag_store:1,
           stores:[],
           store: null,
           category:null,
           subCategory: null,
           color1:'#383B4370',
           color2:'#383B4370',
           color3:'#383B4370',
           color4:'#383B4370',
           id1:3,
           id2:3,
           flag_radio1:true,
           flag_input1:false,
           flag_checkbox1:false,
           sizeId1:null,
           sizeId2:null,
           colorId1: null,
           flag_addSize1:1,
           newSize1:'',
           flag_addColor1:1,
           newColor1:'',
           flag_radio2:true,
           flag_input2:false,
           flag_checkbox2:false,
           flag_addSize2:1,
           newSize2:'',
           newSizeCheck1:'',
           newSizeCheck2:'',
           flag_addSpecification:1,
           image:'',
           image1:null,
           image2:'',
           image3:'',
           image4:'',
           image_list:[],
           size:'',
           color:'',
           title:'',
           description:'',
           quantity:null,
           discount:'',
           price:null,
           ImgToBase64:''
        };
     }
  
      UNSAFE_componentWillMount(){
        this.props.getStoreLocations(this.props.User.token)
        this.props.getCategories()
      }

      componentWillReceiveProps(nextProps) {
         if (nextProps.Message != null) {
             if(nextProps.Message=='Add Product Done'){
                alert('Add Product Done')
             }else{
               alert(nextProps.Message)
             }
               
       }
     }
   
     pickImageFromPhone(id) {
      const options = {
         title: 'Select Image',
         customButton:[
           { name:'customOptionKey' , title:'Choose photo from custom option'},
         ],
         storageOptions: {
            skipBackup: true,
            path: 'images',
         },
      };
      ImagePicker.showImagePicker(options,(response) => {
         this.props.SetLoading(true)
         // console.log('Response = ', response);
         if (response.didCancel) {
            this.props.SetLoading(false)
            console.log('User cancelled image picker');
         } else if (response.error) {
            this.props.SetLoading(false)
            console.log('ImagePicker Error: ', response.error);
         } else if (response.customButton) {
            this.props.SetLoading(false)
            console.log('User tapped custom button: ', response.customButton);
         } else {
            this.props.SetLoading(false)
            const source = { uri: response.uri }
            let sor = { uri: 'data:image/png;base64,' + response.data };
            // console.log('ResponseData = ', sor.uri );
            ImgToBase64.getBase64String(response.uri)
            .then(base64String => {
               console.log('omar '+base64String)
               this.setState({ImgToBase64: base64String})
            })
            .catch(err => {
               console.log('errer '+err) 
            });
           

             if(id==1){
               // const image= "data:image/png;base64," + response.data
               this.setState({image: source.uri})
               this.setState({image1: "data:image/png;base64," +this.state.ImgToBase64})
               const obj={
                  image: "data:image/png;base64," +this.state.ImgToBase64
               }
               this.state.image_list.push(obj)
             }else if(id==2){
               this.setState({image2:source.uri })
               const obj={
                  image: "data:image/png;base64," +this.state.ImgToBase64
               }
               this.state.image_list.push(obj)
             }else if(id==3){
               this.setState({image3:source.uri })
               const obj={
                  image: "data:image/png;base64," +this.state.ImgToBase64
               }
               this.state.image_list.push(obj)
             }else{
               this.setState({image4:source.uri })
               const obj={
                  image: "data:image/png;base64," +this.state.ImgToBase64
               }
               this.state.image_list.push(obj)
             }
         }
      });
   }

      renderHeader() {
        return (
           <View style={[this.props.Language=='AR'? styles.row:styles.rowReversed, styles.shadow, { width: width, height: '8%', alignItems: 'center', backgroundColor: '#383B43', paddingHorizontal: 18 }]} >
             <View style={{justifyContent:'center',margin:5,}}>
              <TouchableOpacity>
             {/* <Icon name="search" size={27} color="#fff" style={{}} /> */}
             </TouchableOpacity>
             
             </View>
             <Text style={{ flex:1,textAlign:'center',color: '#fff', fontSize: 17,fontFamily:'nexa_bold',}}>{this.props.Language=='AR'?'أضافة منتج':'Add Product'}</Text>
     
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

     renderButton1(item,index){
         const { id1 }= this.state
         return(
            <TouchableOpacity onPress={() => { 
               this.setState({id1: item.id})
                if(item.id == 1){
                   this.setState({flag_checkbox1: true , flag_input1: false , flag_radio1: false})
                }else if(item.id ==2){
                  this.setState({flag_checkbox1: false , flag_input1: true , flag_radio1: false})
                }else{
                  this.setState({flag_checkbox1: false , flag_input1: false , flag_radio1: true})
                }
             }} 
            style={[styles.shadow, {  flex:1,borderRadius: 60,alignItems: 'center',justifyContent: 'center',backgroundColor:item.id==id1?'#383B43':'#FFCF06',margin:5}]} >
            <Text style={{ color: item.id==id1?'#FFCF01':'#212121', fontSize: 16,fontFamily:'nexa_bold',padding:6 }}>
                 {this.props.Language == "AR" ? item.nameAR : item.nameEN}
            </Text>
          </TouchableOpacity>
         )
     }

     renderButton2(item,index){
      const { id2 }= this.state
      return(
         <TouchableOpacity onPress={() => { 
            this.setState({id2: item.id})
             if(item.id == 1){
                this.setState({flag_checkbox2: true , flag_input2: false , flag_radio2: false})
             }else if(item.id ==2){
               this.setState({flag_checkbox2: false , flag_input2: true , flag_radio2: false})
             }else{
               this.setState({flag_checkbox2: false , flag_input2: false , flag_radio2: true})
             }
          }} 
         style={[styles.shadow, {  flex:1,borderRadius: 60,alignItems: 'center',justifyContent: 'center',backgroundColor:item.id==id2?'#383B43':'#FFCF06',margin:5}]} >
         <Text style={{ color: item.id==id2?'#FFCF01':'#212121', fontSize: 16,fontFamily:'nexa_bold',padding:6 }}>
              {this.props.Language == "AR" ? item.nameAR : item.nameEN}
         </Text>
       </TouchableOpacity>
      )
  }

     renderRadioView1(){
        return(
          <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
            <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
            <View style={{width:20}}></View>
            <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'90%',textAlignVertical:'center',
              paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
               {this.props.Language=='AR'?'أقتراحات المقاسات':'Size Options'}</Text>  
            </View>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'100%',fontSize:15,color:'#0D0D0D',fontFamily:'nexa_bold',marginTop:10}]}>
               {this.props.Language=='AR'?'أقتراحات':'Options'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
              <View style={{flex:1,flexDirection:'row'}}>
              {
                  listSize1.map((item, index) => {
                     return this.renderSizeItem1(item ,index)
                  })
               }
              </View>
              
           {this.state.flag_addSize1==1?
           <TouchableOpacity 
           onPress={()=>{
              this.setState({flag_addSize1:2})
           }}
           style={[{width:35,alignItems:'center',justifyContent:'center',height:35,borderRadius:35/2,borderWidth:1,borderColor:'#707070',margin:4 }]} >
             <Icon name="plus" size={23} color="#707070" style={{}} />
          </TouchableOpacity>
           :
           <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.shadow,{ width:120,height:40,justifyContent: 'center', alignItems: 'center'}]}>
            <Icon name="plus" size={25} color="#FFCF06" style={{margin:5}}
            onPress={()=>{
               // alert(listSize.length)
               const obj={
                  id: listSize1.length+1,
                  name: this.state.newSize
               }
               listSize1.push(obj)
               this.setState({newSize1:''})
               this.setState({flag_addSize1:1})
            }} /> 
           <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
            <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
            <Input
             defaultValue={this.state.newSize}
             style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
             onChangeText={(text) => this.setState({ newSize1: text })} />
            </Item>
           </View>
           </View>
           }
            </View>

            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
            <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
            <View style={{width:20}}></View>
            <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'90%',textAlignVertical:'center',
              paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
               {this.props.Language=='AR'?'أقتراحات الألوان':'Color Options'}</Text>  
            </View>
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'100%',fontSize:15,color:'#0D0D0D',fontFamily:'nexa_bold',marginTop:10}]}>
               {this.props.Language=='AR'?'أقتراحات':'Options'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
              <View style={{flex:1,flexDirection:'row'}}>
              {
                  listColor1.map((item, index) => {
                     return this.renderColorItem1(item ,index)
                  })
               }
              </View>
              
           {this.state.flag_addColor1==1?
           <TouchableOpacity 
           onPress={()=>{
              this.setState({flag_addColor1:2})
           }}
           style={[{width:35,alignItems:'center',justifyContent:'center',height:35,borderRadius:35/2,borderWidth:1,borderColor:'#707070',margin:4 }]} >
             <Icon name="plus" size={23} color="#707070" style={{}} />
          </TouchableOpacity>
           :
           <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.shadow,{ width:120,height:40,justifyContent: 'center', alignItems: 'center'}]}>
            <Icon name="plus" size={25} color="#FFCF06" style={{margin:5}}
            onPress={()=>{
               // alert(listSize.length)
               const obj={
                  id: listColor1.length+1,
                  name: this.state.newColor1
               }
               listColor1.push(obj)
               this.setState({newColor1:''})
               this.setState({flag_addColor1:1})
            }} /> 
           <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
            <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
            <Input
             defaultValue={this.state.newColor1}
             style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
             onChangeText={(text) => this.setState({ newColor1: text })} />
            </Item>
           </View>
           </View>
           }
            </View>

          </View> 
        )
     }
     renderRadioView2(){
      return(
        <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
          <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
          <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
          <View style={{width:20}}></View>
          <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'90%',textAlignVertical:'center',
            paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
             {this.props.Language=='AR'?'أقتراحات المقاسات':'Size Options'}</Text>  
          </View>
          <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'100%',fontSize:15,color:'#0D0D0D',fontFamily:'nexa_bold',marginTop:10}]}>
             {this.props.Language=='AR'?'أقتراحات':'Options'}</Text>  
          <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
            <View style={{flex:1,flexDirection:'row'}}>
            {
                listSize2.map((item, index) => {
                   return this.renderSizeItem2(item ,index)
                })
             }
            </View>
            
         {this.state.flag_addSize2==1?
         <TouchableOpacity 
         onPress={()=>{
            this.setState({flag_addSize2:2})
         }}
         style={[{width:35,alignItems:'center',justifyContent:'center',height:35,borderRadius:35/2,borderWidth:1,borderColor:'#707070',margin:4 }]} >
           <Icon name="plus" size={23} color="#707070" style={{}} />
        </TouchableOpacity>
         :
         <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.shadow,{ width:120,height:40,justifyContent: 'center', alignItems: 'center'}]}>
          <Icon name="plus" size={25} color="#FFCF06" style={{margin:5}}
          onPress={()=>{
             // alert(listSize.length)
             const obj={
                id: listSize2.length+1,
                name: this.state.newSize2
             }
             listSize2.push(obj)
             this.setState({newSize2:''})
             this.setState({flag_addSize2:1})
          }} /> 
         <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
          <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
          <Input
           defaultValue={this.state.newSize}
           style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
           onChangeText={(text) => this.setState({ newSize2: text })} />
          </Item>
         </View>
         </View>
         }
          </View>
        </View> 
      )
   }
     renderInputView1(){
      return(
         <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
         <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
         <View style={{width:20}}></View>
         {/* <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'95%',textAlignVertical:'center',
           paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
            {this.props.Language=='AR'?'مقاس الوسط':'Waist Size'}</Text>  */}
         <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
          <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
          <Input
           defaultValue={this.state.newSize}
           placeholder={this.props.Language=='AR'?'مقاس الوسط':'Waist Size'}
           style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
           onChangeText={(text) => this.setState({ waistSize: text })} />
          </Item>
         </View> 
         </View>
       </View>
      )
   }

   renderInputView2(){
      return(
         <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
         <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
         <View style={{width:20}}></View>
         <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'95%',textAlignVertical:'center',
           paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
            {this.props.Language=='AR'?'الكميــة':'Waist Size'}</Text>  


         </View>
       </View>
      )
   }
   renderChechboxView1(){
      return(
         <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
         <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
         <View style={{width:20}}></View>
         <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'95%',textAlignVertical:'center',
           paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
            {this.props.Language=='AR'?'الكميــة':'Toppings Options'}</Text>  
         </View>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
            <Text style={{fontSize:14,color:'#707070',fontFamily:'nexa_bold',borderColor:'#707070',borderWidth:1,borderRadius:40,margin:3,padding:5}}>
            {this.props.Language=='AR'?'نباتى':'vegtables'}</Text>
              <View style={{flex:1,flexDirection:'row'}}>
              {
                  listSizeCheck1.map((item, index) => {
                     return this.renderSizeCheckItem1(item ,index)
                  })
               }
              </View>
              
           {this.state.flag_addSize1==1?
           <TouchableOpacity 
           onPress={()=>{
              this.setState({flag_addSize1:2})
           }}
           style={[{width:35,alignItems:'center',justifyContent:'center',height:35,borderRadius:35/2,borderWidth:1,borderColor:'#707070',margin:4 }]} >
             <Icon name="plus" size={23} color="#707070" style={{}} />
          </TouchableOpacity>
           :
           <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.shadow,{ width:120,height:40,justifyContent: 'center', alignItems: 'center'}]}>
            <Icon name="plus" size={25} color="#FFCF06" style={{margin:5}}
            onPress={()=>{
               // alert(listSize.length)
               const obj={
                  id: listSizeCheck1.length+1,
                  name: this.state.newSizeCheck1
               }
               listSizeCheck1.push(obj)
               this.setState({newSizeCheck1:''})
               this.setState({flag_addSize1:1})
            }} /> 
           <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
            <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
            <Input
             defaultValue={this.state.newSizeCheck1}
             style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
             onChangeText={(text) => this.setState({ newSizeCheck1: text })} />
            </Item>
           </View>
           </View>
           }
            </View>
       </View>
      )
   } 

   renderChechboxView2(){
      return(
         <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'97%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
         <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
         <View style={{width:20}}></View>
         <Text style={[styles.shadow,this.props.Language=='AR'?styles.right:styles.left,{flex:1,height:'95%',textAlignVertical:'center',
           paddingHorizontal:10,fontSize:16,color:'#0D0D0D',fontFamily:'nexa_bold',backgroundColor:'#fff',borderRadius:30}]}>
            {this.props.Language=='AR'?'الكميــة':'Toppings Options'}</Text>  
         </View>
         <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'100%',alignItems:'center'}]}>
            <Text style={{fontSize:14,color:'#707070',fontFamily:'nexa_bold',borderColor:'#707070',borderWidth:1,borderRadius:40,margin:3,padding:5}}>
            {this.props.Language=='AR'?'نباتى':'vegtables'}</Text>
              <View style={{flex:1,flexDirection:'row'}}>
              {
                  listSizeCheck2.map((item, index) => {
                     return this.renderSizeCheckItem2(item ,index)
                  })
               }
              </View>
              
           {this.state.flag_addSize2==1?
           <TouchableOpacity 
           onPress={()=>{
              this.setState({flag_addSize2:2})
           }}
           style={[{width:35,alignItems:'center',justifyContent:'center',height:35,borderRadius:35/2,borderWidth:1,borderColor:'#707070',margin:4 }]} >
             <Icon name="plus" size={23} color="#707070" style={{}} />
          </TouchableOpacity>
           :
           <View style={[this.props.Language=='AR'?styles.row:styles.rowReversed,styles.shadow,{ width:120,height:40,justifyContent: 'center', alignItems: 'center'}]}>
            <Icon name="plus" size={25} color="#FFCF06" style={{margin:5}}
            onPress={()=>{
               // alert(listSize.length)
               const obj={
                  id: listSizeCheck2.length+1,
                  name: this.state.newSizeCheck2
               }
               listSizeCheck2.push(obj)
               this.setState({newSizeCheck2:''})
               this.setState({flag_addSize2:1})
            }} /> 
           <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
            <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
            <Input
             defaultValue={this.state.newSizeCheck2}
             style={{fontSize:15,height:50,textAlign:'center',fontFamily:'nexa_bold'}}
             onChangeText={(text) => this.setState({ newSizeCheck2: text })} />
            </Item>
           </View>
           </View>
           }
            </View>
       </View>
      )
   }

   renderSizeItem1(item) {
      const {sizeId1} = this.state
    return (
       <TouchableOpacity activeOpacity={1}
       onPress={()=>{
          this.setState({sizeId1:item.id})
          this.setState({size: item.name})
          alert(item.name)
       }}
        style={[ { justifyContent: 'center',margin:4 }]} >
                   <View
                   style={{width:35,alignItems:'center',justifyContent:'center',margin:10,height:35,borderRadius:35/2,borderWidth:1,backgroundColor:item.id==sizeId1?'#383B43':'#F0F2F5',borderColor:'#707070'}}>
                    <Text style={{color:item.id==sizeId1?'#FFCF06':'#707070',fontSize:14,fontFamily:'nexa_bold'}}>{item.name}</Text>
                   </View>
       </TouchableOpacity>
    )
 }
 renderSizeItem2(item) {
   const {sizeId2} = this.state
 return (
    <TouchableOpacity activeOpacity={1}
    onPress={()=>{
       this.setState({sizeId2:item.id})
       alert(item.id)
    }}
     style={[ { justifyContent: 'center',margin:4 }]} >
                <View
                style={{width:35,alignItems:'center',justifyContent:'center',margin:10,height:35,borderRadius:35/2,borderWidth:1,backgroundColor:item.id==sizeId2?'#383B43':'#F0F2F5',borderColor:'#707070'}}>
                 <Text style={{color:item.id==sizeId2?'#FFCF06':'#707070',fontSize:14,fontFamily:'nexa_bold'}}>{item.name}</Text>
                </View>
    </TouchableOpacity>
 )
} 
renderColorItem1(item) {
   const {colorId1} = this.state
   return (
      <TouchableOpacity activeOpacity={1}
      onPress={()=>{
         this.setState({colorId1:item.id})
         this.setState({color: item.name})
         alert(item.name)
      }}
       style={[ { justifyContent: 'center',margin:4 }]} >
                  <View
                  style={{width:65,alignItems:'center',justifyContent:'center',margin:5,height:30,borderRadius:10,borderWidth:1,backgroundColor:item.id==colorId1?'#383B43':'#F0F2F5',borderColor:'#707070'}}>
                   <Text style={{color:item.id==colorId1?'#FFCF06':'#707070',fontSize:14,fontFamily:'nexa_bold'}}>{item.name}</Text>
                  </View>
      </TouchableOpacity>
   )
}
 renderSizeCheckItem1(item) {
   const {sizeId1} = this.state
 return (
    <TouchableOpacity activeOpacity={1}
    onPress={()=>{
       this.setState({sizeId1:item.id})
       alert(item.id)
    }}
     style={[ { justifyContent: 'center',margin:4 }]} >
                <View
                style={{width:35,alignItems:'center',justifyContent:'center',margin:10,height:35,borderRadius:35/2,borderWidth:1,backgroundColor:item.id==sizeId1?'#383B43':'#F0F2F5',borderColor:'#707070'}}>
                 <Text style={{color:item.id==sizeId1?'#FFCF06':'#707070',fontSize:14,fontFamily:'nexa_bold'}}>{item.name}</Text>
                </View>
    </TouchableOpacity>
 )
}

renderSizeCheckItem2(item) {
   const {sizeId2} = this.state
 return (
    <TouchableOpacity activeOpacity={1}
    onPress={()=>{
       this.setState({sizeId2:item.id})
       alert(item.id)
    }}
     style={[ { justifyContent: 'center',margin:4 }]} >
                <View
                style={{width:35,alignItems:'center',justifyContent:'center',margin:10,height:35,borderRadius:35/2,borderWidth:1,backgroundColor:item.id==sizeId2?'#383B43':'#F0F2F5',borderColor:'#707070'}}>
                 <Text style={{color:item.id==sizeId2?'#FFCF06':'#707070',fontSize:14,fontFamily:'nexa_bold'}}>{item.name}</Text>
                </View>
    </TouchableOpacity>
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
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'صور المنتج':'Product Images'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center'}]}>
                <TouchableOpacity
                onPress={()=> this.pickImageFromPhone(1)}
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                <Image source={{uri: this.state.image}}
                   style={{width:'100%',height:'100%',borderRadius:5}}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=> this.pickImageFromPhone(2)}
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                   <Image source={{uri: this.state.image2}}
                   style={{width:'100%',height:'100%',borderRadius:5}}></Image>
                </TouchableOpacity>
                {this.state.flag_img==1?
                <TouchableOpacity
                 onPress={()=>this.setState({flag_img:2})}
                style={{width:40,height:40,borderRadius:20,backgroundColor:'#FFCF01',alignItems:'center',justifyContent:'center',margin:5}}>
                <Icon name="plus" size={25} color="#212121" style={{}} />
                </TouchableOpacity>
                :
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                onPress={()=> this.pickImageFromPhone(3)}
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                <Image source={{uri: this.state.image3}}
                   style={{width:'100%',height:'100%',borderRadius:5}}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=> this.pickImageFromPhone(4)}
                style={{width:80,height:80,borderRadius:5,backgroundColor:'#707070',margin:5}}>
                  <Image source={{uri: this.state.image4}}
                   style={{width:'100%',height:'100%',borderRadius:5}}></Image>
                </TouchableOpacity>
                </View>
                }
                
            </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

               {/* ************************************** */}
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'العنوان':'Title'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.title}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:14,height:50,marginHorizontal:10 }]}
                       onChangeText={(text) => this.setState({ title: text })} />
                  </Item>
               </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'الوصــف':'Description'}</Text>  
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Item style={[styles.inputFields, styles.shadow, { }]}>
                     <Input
                      defaultValue={this.state.description}
                      multiline={true}
                      style={[this.props.Language == "AR" ? styles.right :styles.left ,{fontSize:14,height:height*0.15,textAlignVertical:'top',marginHorizontal:10 }]}
                       onChangeText={(text) => this.setState({ description: text })} />
                  </Item>
               </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'السعــر':'Price'}</Text>  
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                <TextInput
                style={{fontSize:20,color:'#000',fontFamily:'nexa_bold',height:'100%',flex:1,marginHorizontal:10}}
                keyboardType='numeric'
                onChangeText={(text) => this.setState({ price: text })}></TextInput>
                <Text style={{fontSize:20,color:'#000',fontFamily:'nexa_bold',margin:10}}>K.D.W</Text>  
            </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'التخفيض':'Discount'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                <TextInput
                style={{fontSize:20,color:'#000',fontFamily:'nexa_bold',height:'100%',flex:1,marginHorizontal:10}}
                keyboardType='numeric'
                onChangeText={(text) => this.setState({ discount: text })}></TextInput>
                <Text style={{fontSize:20,color:'#000',fontFamily:'nexa_bold',margin:10}}>%</Text>  
            </View>
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'أضافة متجر':'Add Store'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.props.StoresLocations} // data
                 defaultValue={this.props.Language == "AR"?' الفئــة':'Category'}
                 onSelect={(index, value) => { 
                 this.setState({ store: value.id , color1:'#000' }) 
                 }}
                 renderButtonText={(rowData) => (rowData.name)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 18,paddingHorizontal:'5%', color: this.state.color1,fontFamily:'nexa_bold'}]}
                 dropdownStyle={[styles.shadow,{ width: '60%', height:100,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
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
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
            <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'الكميــة':'Quantity'}</Text>  
            <View style={{width:20}}></View>
            <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
                  <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
                     <Input
                      defaultValue={this.state.quantity}
                      style={{fontSize:14,height:50,textAlign:'center'}}
                      keyboardType='numeric'
                       onChangeText={(text) => this.setState({ quantity: text })} />
                  </Item>
               </View>
            </View>
             
            {this.state.flag_store==1?
                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
                <TouchableOpacity onPress={() => { this.setState({flag_store:2}) }} style={[styles.Button, styles.shadow, { width: '35%', backgroundColor: '#383B43' }]} >
                  <Text style={{ color: '#FFCF06', fontSize: 18,fontFamily:'nexa_bold', }}>
                       {this.props.Language == "AR" ? 'أضافة متجر' : 'Add Store'}
                  </Text>
                </TouchableOpacity>
              </View>
                :
                <View style={{}}>
                <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

                   {/* ******************************************** */}
             <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'أضافة متجر':'Add Store'}</Text>  
             <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
               backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
             <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
             <ModalDropdown
              options={this.props.StoresLocations} // data
              defaultValue={this.props.Language == "AR"?' الفئــة':'Category'}
              onSelect={(index, value) => { 
              this.setState({ store: value.id , color1:'#000' }) 
               }}
              renderButtonText={(rowData) => (rowData.name)} // ba3d ma t5tar
              style={{ width:'100%',}} // abl ma t5tar
              textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 18,paddingHorizontal:'5%', color: this.state.color1,fontFamily:'nexa_bold'}]}
             dropdownStyle={[styles.shadow,{ width: '60%', height:100,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
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
             <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

          {/* ******************************************** */}
          <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',marginTop:10 }]}>
         <Text style={{fontSize:18,color:'#21212170',fontFamily:'nexa_bold'}}>{this.props.Language=='AR'?'الكميــة':'Quantity'}</Text>  
         <View style={{width:20}}></View>
           <View style={[{ flex:1,justifyContent: 'center', alignItems: 'center',}]}>
            <Item style={[styles.shadow, { flex:1,color:'#424242',backgroundColor:'#fff',borderRadius:30,}]}>
            <Input
             defaultValue={this.state.quantity}
             style={{fontSize:14,height:50,textAlign:'center'}}
             keyboardType='numeric'
             onChangeText={(text) => this.setState({ quantity: text })} />
            </Item>
           </View>
           </View>
          </View>
         }

                 {/* ******************************************** */}
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'أضافة فئـة':'Add Category'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.props.Categories} // data
                 defaultValue={this.props.Language == "AR"?' الفئــة':'Category'}
                 onSelect={(index, value) => { 
                 this.setState({ category: value.id , color2:'#000' }) 
                 alert( value.id)
                 this.props.getSubCategories(value.id)
                 }}
                 renderButtonText={(rowData) => (rowData.name)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 18,paddingHorizontal:'5%', color: this.state.color2,fontFamily:'nexa_bold'}]}
                 dropdownStyle={[styles.shadow,{ width: '60%', height:100,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
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
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.props.SubCategories} // data
                 defaultValue={this.props.Language == "AR"?' الفئـة الجزئيـة':'SubCategory'}
                 onSelect={(index, value) => { 
                 this.setState({ subCategory: value.id , color3:'#000' }) 
                 }}
                 renderButtonText={(rowData) => (rowData.name)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 18,paddingHorizontal:'5%', color: this.state.color3,fontFamily:'nexa_bold'}]}
                 dropdownStyle={[styles.shadow,{ width: '60%', height:100,borderRadius: 8,backgroundColor:'#FAFAFA',}]}
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
            <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>

            {/* ******************************************** */}   
            <Text style={[this.props.Language=='AR'?styles.right:styles.left,{width:'90%',fontSize:16,color:'#21212170',fontFamily:'nexa_bold',marginTop:10}]}>{this.props.Language=='AR'?'أضافة تصنيـف':'Add Filter'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,styles.shadow,{ width:'90%',height:50,justifyContent: 'center', alignItems: 'center',
             backgroundColor:'#f5f5f5',borderRadius:20,borderWidth:0.3,borderColor:'#707070',marginTop:10 }]}>
                 <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 <ModalDropdown
                 options={this.state.stores} // data
                 defaultValue={this.props.Language == "AR"?' الفئــة':'Category'}
                 onSelect={(index, value) => { 
                 this.setState({ store: value.label , color4:'#000' }) 
                 }}
                 renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                 style={{ width:'100%',}} // abl ma t5tar
                 textStyle={[this.props.Language == "AR"?styles.right:styles.left,{fontSize: 18,paddingHorizontal:'5%', color: this.state.color4,fontFamily:'nexa_bold'}]}
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
             
             <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>
            {/* ******************************************** */}  
            <Text style={{width:'90%',fontSize:15,color:'#212121',textAlign:'center',fontFamily:'nexa_bold',marginTop:15}}>{this.props.Language=='AR'?'أضافة تخصيـص':'Add Specification'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
               {
                  list1.map((item, index) => {
                     return this.renderButton1(item ,index)
                  })
               }
            </View>
             {this.state.flag_radio1?
               this.renderRadioView1()
             :
              this.state.flag_input1? this.renderInputView1(): this.renderChechboxView1()
             }
             <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>
            {/* ******************************************** */}  

            {this.state.flag_addSpecification==1?
             <TouchableOpacity onPress={() => {this.setState({flag_addSpecification:2}) }} 
              style={[styles.Button, styles.shadow, { width: '40%', backgroundColor: '#383B43',flexDirection:'row',marginTop:10 }]} >
              <Icon name="plus" size={20} color="#FFCF06" style={{margin:5}} />
              <Text style={{ color: '#FFCF06', fontSize: 15,fontFamily:'nexa_bold', }}>
                   {this.props.Language == "AR" ? 'أضافة تخصيص' : 'Add Specification'}
              </Text>
            </TouchableOpacity>
            :
            <View style={{width:'90%',alignItems:'center',justifyContent:'center'}}>
            <Text style={{width:'90%',fontSize:15,color:'#212121',textAlign:'center',fontFamily:'nexa_bold',marginTop:15}}>{this.props.Language=='AR'?'أضافة تخصيـص':'Add Specification'}</Text>  
            <View style={[this.props.Language=='AR'?styles.rowReversed:styles.row,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:10}]}>
               {
                  list2.map((item, index) => {
                     return this.renderButton2(item ,index)
                  })
               }
            </View>
             {this.state.flag_radio2?
               this.renderRadioView2()
             :
              this.state.flag_input2? this.renderInputView2(): this.renderChechboxView2()
             }
             <View style={{width:'100%',height:1,backgroundColor:'#70707025',marginTop:15}}></View>
             </View>
            }


              <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
                <TouchableOpacity onPress={() => { 
                     this.props.addProduct(this.props.User.token,this.state.title,this.state.description,this.state.image1,
                     this.state.image_list,this.state.category,this.state.subCategory,this.state.store,this.state.quantity,
                     this.state.price,this.state.discount,this.state.size,this.state.color,'unisex',this.state.description)
                 }} 
                style={[styles.Button, styles.shadow, { width: '90%', backgroundColor: '#383B43',paddingVertical:15 }]} >
                  <Text style={{ color: '#FFCF06', fontSize: 20,fontFamily:'nexa_bold', }}>
                       {this.props.Language == "AR" ? 'تنفيـذ' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>

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
       StoresLocations: state.AuthReducer.StoresLocations,
       Categories: state.AuthReducer.Categories,
       SubCategories: state.AuthReducer.SubCategories
    }
 }
 // redux
 export default connect(mapStateToProps, { SetLoading , getStoreLocations , getCategories , getSubCategories , addProduct})(AddProduct)
 
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
   inputFields: {
    width:'90%',
    color: '#424242',
    backgroundColor:'#fff',
    borderRadius:30,
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
    paddingVertical: 3,
    marginBottom: 10,
    marginHorizontal: 36
},
 });