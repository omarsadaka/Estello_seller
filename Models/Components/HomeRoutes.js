import React, { Component } from 'react';
import { createAppContainer } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Home from './Home/Home'
import Views from './Home/Views'
import AddProduct from './Home/AddProduct'
import DeliveredOrders from './Home/DeliveredOrders'
import PendingOrders from './Home/PendingOrders'
import OrderDetails from './Home/OrderDetails'
import Revenue from './Home/Revenue'
import Staff from './Home/Staff'
import AddStaff from './Home/AddStaff'
import StaffView from './Home/StaffView'
import Drivers from './Home/Drivers'
import AddDrivers from './Home/AddDrivers'
import DriverView from './Home/DriverView'
import StoreProfilePicture from './Home/StoreProfilePicture'
import Stores from  './Home/Stores'
import AddNewStore from './Home/AddNewStore'
import EditStore from './Home/EditStore'
import PickupLocation from './Home/PickupLocation'
import MyProfile from './Home/MyProfile'
import AddCustomization from './Home/AddCustomization'
import StaffAccount from './Home/StaffAccount'
import DriverProfile from './Home/DriverProfile'
import ProductDetail from  './Home/ProductDetail'





const HomeRoutes = createStackNavigator(
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
         MyProfile: {
            screen: MyProfile,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         AddCustomization: {
            screen: AddCustomization,
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
         ProductDetail: {
            screen: ProductDetail,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
        
         
        
         
     
     
     
    },
    {
      initialRouteName: 'Home',
    },
  );
  
  const AppContainer = createAppContainer(HomeRoutes);
  export default AppContainer;

