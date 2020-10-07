import axios from 'axios'
import { AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';


export const UserLogin = (email, password) => {
    return async (dispatch) => {
        dispatch({ type: 'LOGIN_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/login/', {
                email , password
            }).then((response)=> {
                if(response.data){
                    // alert(response.data.token +response.data.user_type )
                    const usr = {
                        token: response.data.token ,
                        user_type: response.data.user_type
                    }
                    // alert(JSON.stringify(usr))
                    AsyncStorage.setItem('User', JSON.stringify(usr))
                    dispatch({ type: 'LOGIN_SUCCESS', payload: usr })
                }
                   
            }).catch((error)=> {
                dispatch({ type: 'LOGIN_FAILED', payload: error.message })
                if (error.response.data.error) {
                    dispatch({ type: 'LOGIN_FAILED', payload: error.response.data.error })
                } else {
                    dispatch({ type: 'LOGIN_FAILED', payload: "Something went wrong" })
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'LOGIN_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const SaveUser = (usr) => {
    return (dispatch) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: usr })
    }
}
export const ForgetPwd = (email) => {
    return async (dispatch) => {
        dispatch({ type: 'FORGETPWD_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/forget_password/', {
                email 
            }).then((response)=> {
                if(response.data.detail=='reset code sent successfully.'){
                    dispatch({ type: 'FORGETPWD_SUCCESS' })
                }
                   
            }).catch((error)=> {
                dispatch({ type: 'FORGETPWD_FAILED', payload: error.message })
                if (error.response.data.error) {
                    dispatch({ type: 'FORGETPWD_FAILED', payload: error.response.data.error })
                } else {
                    dispatch({ type: 'FORGETPWD_FAILED', payload: "Something went wrong" })
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'FORGETPWD_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'FORGETPWD_FAILED', payload: "No internet connection" })
       }
     });
    }
} 
export const UserRegister = ( store,email,phone,terms_of_use,password,cash,k_net,credit_card,delivery_method,locations) => {
    return async (dispatch) => {
        dispatch({ type: 'REGISTER_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_signup/', {
                store, email, phone, terms_of_use, password, cash, k_net, credit_card, delivery_method, locations,
                describtion:'hhh'
            }).then((response)=> {
                if(response.data.detail=='successfully sign up'){
                    dispatch({ type: 'REGISTER_SUCCESS' })
                }
               
            }).catch( (error)=> {
                // dispatch({ type: 'REGISTER_FAILED', payload: error.message })
                if(error.response.data.error){
                    if (error.response.data.error.email) {
                        dispatch({ type: 'REGISTER_FAILED', payload: 'user with this Email already exists.' })
                    } else if(error.response.data.error.phone){
                        dispatch({ type: 'REGISTER_FAILED', payload: 'user with user with this Phone already exists.' })
                    }
                    else {
                        dispatch({ type: 'REGISTER_FAILED', payload: "Something went wrong" })
                    }
                }
               
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'REGISTER_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'REGISTER_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const SetLoading = ( bool ) => {
    return (dispatch) => {
        dispatch({ type: 'LOADING_USER', payload: bool })
    }
}
export const getSellerProduct=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'SELLERPRODUCT_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_products/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.list
                const products = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        id: Data[index].id,
                        name: Data[index].name,
                        price: Data[index].price,
                        image: Data[index].image,
                        viewed: Data[index].viewed
                    }
                 
                    products.push(obj)
                }
                dispatch({ type: 'SELLERPRODUCT_SUCCESS', payload: products})
            }).catch((error)=> {
                dispatch({ type: 'SELLERPRODUCT_FAILED', payload: error.message })
                if (error.response.data.error) {
                    dispatch({ type: 'SELLERPRODUCT_FAILED', payload: error.response.data.error })
                } else {
                    dispatch({ type: 'SELLERPRODUCT_FAILED', payload: "Something went wrong" })
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'SELLERPRODUCT_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'SELLERPRODUCT_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getStoreLocations=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'STORELOCATIONS_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get(' http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/location/', {
                headers: {
                    'Authorization': 'Token '+Token
                  }
            }).then((response)=> {
                var Data = response.data.list
                const stores = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        name: Data[index].location_name,
                        id: Data[index].id
                    }
                 
                    stores.push(obj)
                }
                dispatch({ type: 'STORELOCATIONS_SUCCESS', payload: stores })
            }).catch((error)=> {
                dispatch({ type: 'STORELOCATIONS_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'STORELOCATIONS_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'STORELOCATIONS_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getCategories=( )=>{
    return async (dispatch) => {
        dispatch({ type: 'CATEGORY_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/product/categories/')
            .then((response)=> {
                const Data = response.data;
                const categories = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        name: Data[index].name,
                        id: Data[index].id,
                        image: Data[index].image,
                        describtion: Data[index].describtion,
                    }
                 
                    categories.push(obj)
                }
                dispatch({ type: 'CATEGORY_SUCCESS', payload: categories })
            }).catch((error)=> {
                dispatch({ type: 'CATEGORY_FAILED', payload: error })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'CATEGORY_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'CATEGORY_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getDeals=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'DEALS_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/deal/',{
                headers: {
                    'Authorization': 'Token '+Token
                  }
            }).then((response)=> {
                const Data = response.data;
                const deals = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        id: Data[index].id,
                        title: Data[index].title,
                        describtion: Data[index].describtion,
                        image: Data[index].images[0]
                    }
                 
                    deals.push(obj)
                }
                dispatch({ type: 'DEALS_SUCCESS', payload: deals })
            }).catch((error)=> {
                dispatch({ type: 'DEALS_FAILED', payload: error })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'DEALS_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'DEALS_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getSubCategories=(id)=>{
    return async (dispatch) => {
        dispatch({ type: 'SUBCATEGORY_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/product/category_subs/'+id,{
            })
            .then((response)=> {
                const Data = response.data.detail;
                const subCategories = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        name: Data[index].name,
                        id: Data[index].id
                    }
                 
                    subCategories.push(obj)
                }
                dispatch({ type: 'SUBCATEGORY_SUCCESS', payload: subCategories })
            }).catch((error)=> {
                dispatch({ type: 'SUBCATEGORY_FAILED', payload: error })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'SUBCATEGORY_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'SUBCATEGORY_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const addProduct = (Token ,name,describtion,image,image_list,category,sub_category,location,quantity,
    price,discount,size,color,sex,notes ) => {
    return async (dispatch) => {
        dispatch({ type: 'ADDPRODUCT_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/product/product/',{
                name,describtion,image,image_list,category,sub_category,location,quantity,
                price,discount,size,color,sex,notes
             }, { headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                  if(response.data){
                    dispatch({ type: 'ADDPRODUCT_SUCCESS' })
                  }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                if(error.response.data.error.image){
                    dispatch({ type: 'ADDPRODUCT_FAILED', payload: error.response.data.error.image })
                }else{
                    dispatch({ type: 'ADDPRODUCT_FAILED', payload: error.message })
                }
                
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'ADDPRODUCT_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'ADDPRODUCT_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getProfile=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'GETPROFILE_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_seller_profile/1', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data
                const data = {
                    store: Data.store,
                    email: Data.email,
                    phone: Data.phone,
                    photo: Data.photo,
                    city: Data.city,
                    user_type: Data.user_type
                }
                
                dispatch({ type: 'GETPROFILE_SUCCESS', payload: data})
            }).catch((error)=> {
                dispatch({ type: 'GETPROFILE_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'GETPROFILE_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'GETPROFILE_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const addStaff = (Token ,name,email,phone,password,authorization ) => {
    return async (dispatch) => {
        dispatch({ type: 'ADDSTAFF_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/add_staff/',{
                name,email,phone,password,authorization,
             }, { headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                  if(response.data.detail=='Added Successfully'){
                    dispatch({ type: 'ADDSTAFF_SUCCESS' })
                  }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                // dispatch({ type: 'ADDSTAFF_FAILED', payload: error.message })
                if(error.response.data.error){
                    if (error.response.data.error.phone) {
                        dispatch({ type: 'ADDSTAFF_FAILED', payload: 'The phone number entered is not valid.' })
                    }else {
                        dispatch({ type: 'ADDSTAFF_FAILED', payload: "Something went wrong" })
                    }
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'ADDSTAFF_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'ADDSTAFF_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getStatistics=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'STATISTIC_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/seller_statistics/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data
                const data = {
                    pending_orders_today: Data.Today.pending_orders,
                    delivered_orders_today: Data.Today.delivered_orders,
                    revenue_today: Data.Today.revenue,
                    pending_orders_month: Data.Month.pending_orders,
                    delivered_orders_month: Data.Month.delivered_orders,
                    revenue_month: Data.Month.revenue,
                    male_percentage: Data.client_demography.male_percentage,
                    female_percentage: Data.client_demography.female_percentage

                }
                
                dispatch({ type: 'STATISTIC_SUCCESS', payload: data})
            }).catch((error)=> {
                // dispatch({ type: 'STATISTIC_FAILED', payload: error.message })
                dispatch({ type: 'STATISTIC_FAILED', payload: "Server Error!"  })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'STATISTIC_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'STATISTIC_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getPendingOrders=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'PENDING_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/pending_orders/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.list
                const pending = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        id: Data[index].id,
                        orderID: Data[index].orderID,
                        customer_name: Data[index].customer_name,
                        customer_phone: Data[index].customer_phone,
                    }
                 
                    pending.push(obj)
                }
                if(Data.length==0){
                    alert('No Orders Now')
                }
                
                dispatch({ type: 'PENDING_SUCCESS', payload: pending})
            }).catch((error)=> {
                dispatch({ type: 'PENDING_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'PENDING_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'PENDING_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getDeliveredOrders=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'DELIVERED_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/delivered_orders/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.list
                if(Data.length==0){
                    alert('No Orders Now')
                }
                
                dispatch({ type: 'DELIVERED_SUCCESS', payload: Data})
            }).catch((error)=> {
                dispatch({ type: 'DELIVERED_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'DELIVERED_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'DELIVERED_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getRevenue=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'REVENUE_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/revenue_detail/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.products
                const data = {
                    week1_revenue: response.data.week1_revenue,
                    week2_revenue: response.data.week2_revenue,
                    week3_revenue: response.data.week3_revenue,
                    week4_revenue: response.data.week4_revenue,
                    total_revenue: response.data.total_revenue,
                }
                if(Data.length==0){
                    alert('No Products Now')
                }
                
                dispatch({ type: 'REVENUE_SUCCESS', payload1: Data , payload2: data})
            }).catch((error)=> {
                dispatch({ type: 'REVENUE_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'REVENUE_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'REVENUE_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getStaff=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'GETSTAFF_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_staffs', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.list
                const staff = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        name: Data[index].name,
                        id: Data[index].id,
                        email: Data[index].email,
                        phone: Data[index].phone,
                        authorization: Data[index].authorization,
                        status: Data[index].status,
                    }
                 
                    staff.push(obj)
                }
                if(Data.length==0){
                    alert('No Staff Now')
                }
                
                dispatch({ type: 'GETSTAFF_SUCCESS', payload: staff})
            }).catch((error)=> {
                dispatch({ type: 'GETSTAFF_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'GETSTAFF_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'GETSTAFF_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getDrivers=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'GETDRIVER_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/driver/seller_drivers/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data.list
                const drivers = []
                for (let index = 0; index < Data.length; index++) {
                    var obj = {
                        name: Data[index].name,
                        id: Data[index].id,
                        email: Data[index].email,
                        phone: Data[index].phone,
                        status: Data[index].status,
                    }
                    drivers.push(obj)
                }
                if(Data.length==0){
                    alert('No drivers Now')
                }
                dispatch({ type: 'GETDRIVER_SUCCESS', payload: drivers})
            }).catch((error)=> {
                dispatch({ type: 'GETDRIVER_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'GETDRIVER_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'GETDRIVER_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const addDriver = (Token ,name,email,phone,password) => {
    return async (dispatch) => {
        dispatch({ type: 'ADDDRIVER_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/driver/driver_signup/',{
                name,email,phone,password,
             }, { headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                  if(response.data.detail=='successfully sign up'){
                    dispatch({ type: 'ADDDRIVER_SUCCESS' })
                  }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                // dispatch({ type: 'ADDDRIVER_FAILED', payload: error.message })
                if(error.response.data.error){
                    if (error.response.data.error.phone) {
                        dispatch({ type: 'ADDDRIVER_FAILED', payload: 'The phone number entered is not valid.' })
                    }else {
                        dispatch({ type: 'ADDDRIVER_FAILED', payload: "Something went wrong" })
                    }
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'ADDDRIVER_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'ADDDRIVER_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const ChangePwd=(Token , password , new_password )=>{
    return async (dispatch) => {
        dispatch({ type: 'CHANGEPWD_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/change_password/',{
              password , new_password
            }, 
            {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                if(response.data.detail){
                    alert(response.data.detail)
                    dispatch({ type: 'CHANGEPWD_SUCCESS'})
                }
               
            }).catch((error)=> {
                if(error.response.data.password){
                    dispatch({ type: 'CHANGEPWD_FAILED', payload: error.response.data.password })
                }else{
                    dispatch({ type: 'CHANGEPWD_FAILED', payload: error.message })
                }
                
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'CHANGEPWD_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'CHANGEPWD_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const resetPwd=(Token , password , id )=>{
    return async (dispatch) => {
        dispatch({ type: 'RESETPWD_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/accounts/reset_password/'+id+'/',{
              password 
            }, 
            {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                if(response.data.detail){
                    alert(response.data.detail)
                    dispatch({ type: 'RESETPWD_SUCCESS'})
                }
               
            }).catch((error)=> {
                dispatch({ type: 'RESETPWD_FAILED', payload: error.message })
                
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'RESETPWD_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'RESETPWD_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const addCustomization = (Token , style , type , list) => {
    return async (dispatch) => {
        dispatch({ type: 'ADDCUSTOMIZATION_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/customization',{
                style , type , list
             }, { headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                  if(response.data.detail=='Successfully Added'){
                    dispatch({ type: 'ADDCUSTOMIZATION_SUCCESS' })
                  }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                dispatch({ type: 'ADDCUSTOMIZATION_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'ADDCUSTOMIZATION_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'ADDCUSTOMIZATION_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const getCustomization=(Token )=>{
    return async (dispatch) => {
        dispatch({ type: 'GETCUSTOMIZATION_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.get('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/get_customization', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                var Data = response.data
                const customization = []
                const style = Data.style
                var product = Data.products
                var deal = Data.deals
                var category = Data.categories
                    for (let index = 0; index < deal.length; index++) {
                        var obj = {
                            id: deal[index].id,
                            name: deal[index].title,
                            image: deal[index].images[0],
                            describtion: deal[index].describtion,
                        }
                        customization.push(obj)
                    }
                    for (let index = 0; index < product.length; index++) {
                        var obj = {
                            id: product[index].id,
                            name: product[index].name,
                            image: product[index].image,
                            describtion: product[index].describtion,
                        }
                        customization.push(obj)
                    }
                    for (let index = 0; index < category.length; index++) {
                        var obj = {
                            id: category[index].id,
                            name: category[index].name,
                            image: category[index].image,
                            describtion: category[index].describtion,
                        }
                        customization.push(obj)
                }
               
                dispatch({ type: 'GETCUSTOMIZATION_SUCCESS', payload1: customization , payload2: style})
            }).catch((error)=> {
                dispatch({ type: 'GETCUSTOMIZATION_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'GETCUSTOMIZATION_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'GETCUSTOMIZATION_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const updateProfilePicture = (Token , store , describtion) => {
    return async (dispatch) => {
        dispatch({ type: 'UPDATEPICTURE_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.put('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/seller/update_seller_profile/',{
                store , describtion
             }, { headers: { 
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                if(response.data.detail){
                    alert(response.data.detail)
                    dispatch({ type: 'UPDATEPICTURE_SUCCESS' })

                 }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                dispatch({ type: 'UPDATEPICTURE_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'UPDATEPICTURE_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'UPDATEPICTURE_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const deleteProduct=(Token ,id )=>{
    return async (dispatch) => {
        dispatch({ type: 'DELPRODUCT_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.delete('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/product/update_delete_product/'+id+'/', {
                headers: {
                    'Authorization': 'Token '+Token,
                  }
            }).then((response)=> {
                 if(response.data.detail=='your product has been deleted successfully'){
                    dispatch({ type: 'DELPRODUCT_SUCCESS'})
                 }
            }).catch((error)=> {
                // dispatch({ type: 'DELPRODUCT_FAILED', payload: error.message })
                if (error.response.data.error) {
                    dispatch({ type: 'DELPRODUCT_FAILED', payload: error.response.data.error })
                } else {
                    dispatch({ type: 'DELPRODUCT_FAILED', payload: "Something went wrong" })
                }
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'DELPRODUCT_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'DELPRODUCT_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const updateProduct = (Token , id , obj) => {
    return async (dispatch) => {
        dispatch({ type: 'UPDATEPRODUCT_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.put('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/product/update_delete_product/'+id+'/',{
                name: obj.name,
                describtion: obj.describtion,
                quantity: obj.quantity,
                price: obj.price,
                discount: obj.discount,
                sub_category: obj.sub_category,
                category: obj.category,
                location: obj.location
             }, { headers: { 
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                if(response.data.detail){
                    alert(response.data.detail)
                    dispatch({ type: 'UPDATEPRODUCT_SUCCESS' })

                 }
            }).catch( (error)=> {
                console.log(error.response.data.error)
                dispatch({ type: 'UPDATEPRODUCT_FAILED', payload: error.message })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'UPDATEPRODUCT_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'UPDATEPRODUCT_FAILED', payload: "No internet connection" })
       }
     });
    }
}
export const assignDriver = (Token , driver_id  , order_id ) => {
    return async (dispatch) => {
        dispatch({ type: 'ASSIGN_ATTEMP' })
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
        try {
            axios.post('http://ec2-3-19-72-49.us-east-2.compute.amazonaws.com/order/assign_driver/',{
                driver_id , order_id 
             }, { headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': 'Token '+Token
              }}).then((response)=> {
                  if(response.data.detail=='Driver Assigned to the order successfully'){
                    dispatch({ type: 'ASSIGN_SUCCESS' })
                  }
            }).catch( (error)=> {
                console.log(error.response.data)
                dispatch({ type: 'ASSIGN_FAILED', payload: error.response.data })
            }).finally(function () {
                // always executed
            });
        } catch (error) {
            dispatch({ type: 'ASSIGN_FAILED', payload: "Something went wrong" })
        }
    } else {
        dispatch({ type: 'ASSIGN_FAILED', payload: "No internet connection" })
       }
     });
    }
}


 


