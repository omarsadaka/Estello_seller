import React, { Component } from 'react';
import { createAppContainer } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Home from './Home'
import Views from './Views'
import AddProduct from './AddProduct'
import DeliveredOrders from './DeliveredOrders'
import PendingOrders from './PendingOrders'
import OrderDetails from './OrderDetails'
import Revenue from './Revenue'
import Staff from './Staff'
import AddStaff from './AddStaff'
import StaffView from './StaffView'
import Drivers from './Drivers'
import AddDrivers from './AddDrivers'
import DriverView from './DriverView'
import StoreProfilePicture from './StoreProfilePicture'
import Stores from  './Stores'
import AddNewStore from './AddNewStore'
import EditStore from './EditStore'
import PickupLocation from './PickupLocation'
import StaffAccount from './StaffAccount'
import DriverProfile from './DriverProfile'





const AppRoutes = createStackNavigator(
    {
      Home: {
         screen: Home,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
        Views: {
            screen: Views,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         AddProduct: {
            screen: AddProduct,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         DeliveredOrders: {
            screen: DeliveredOrders,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         PendingOrders: {
            screen: PendingOrders,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         OrderDetails: {
            screen: OrderDetails,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         Revenue: {
            screen: Revenue,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         Staff: {
            screen: Staff,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         AddStaff: {
            screen: AddStaff,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         StaffView: {
            screen: StaffView,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         Drivers: {
            screen: Drivers,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         AddDrivers: {
            screen: AddDrivers,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         DriverView: {
            screen: DriverView,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         StoreProfilePicture: {
            screen: StoreProfilePicture,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         Stores: {
            screen: Stores,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         AddNewStore: {
            screen: AddNewStore,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         EditStore: {
            screen: EditStore,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         PickupLocation: {
            screen: PickupLocation,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         StaffAccount: {
            screen: StaffAccount,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         DriverProfile: {
            screen: DriverProfile,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
       
        
         
        
         
     
     
     
    },
    {
      initialRouteName: 'Home',
    },
  );
  
  const AppContainer = createAppContainer(AppRoutes);
  export default AppContainer;

