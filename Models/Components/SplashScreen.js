import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar,ImageBackground , Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get('window')

//import { AsyncStorage } from 'react-native';

export default class SplashScreen extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   componentDidMount() {
      setTimeout(() => {
         this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
               // ChooseLanguage
               NavigationActions.navigate({ routeName: 'ChooseLanguage' })
            ],
         }))
      }, 2000)
   }

   render() {
      return (
         <ImageBackground style={styles.container} 
         source={require('./../../image/bg.png')}>
            <StatusBar backgroundColor='#383B43' barStyle="light-content" />
            <Image source={require('./../../image/logo.png')} style={[styles.image, { marginTop: 200 }]} resizeMode='contain' />
            <Image source={require('./../../image/bottom_bg.png')} 
            style={{ width: width, height: '20%', position: 'absolute', bottom: 0 }}  resizeMode='stretch' />
         </ImageBackground>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#FFF',
   },
   image: {
      width: 200,
      height: 70,
      alignItems:'center'
   },
});