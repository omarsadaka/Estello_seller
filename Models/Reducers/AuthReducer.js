const initialState = {
    Processing: false,
    Message: null,
    User: null,
    UserData :null,
    Categories:[],
    Deals:[],
    SubCategories: [],
    StoresLocations:[],
    Products:[],
    SellerData:{},
    Statistics:{},
    PendingOrders:[],
    DeliveredOrders:[],
    Staff:[],
    Drivers:[],
    ProductRevenue:[],
    RevenueData:{},
    Customizations:[],
    Style: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_ATTEMP':
            return {
                ...state,
                Message: null,
                Processing: true
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                Processing: false,
                User: {
                    token: action.payload.token ,
                    user_type: action.payload.user_type
                },
                Message: "Login Done",
            }
        case 'LOGIN_FAILED':
            return {
                ...state,
                Processing: false,
                Message: action.payload
            }

        case 'LOGOUT_ATTEMP':
            return { ...state, Processing: true, Message: null, }
        case 'LOGOUT_SUCCESS':
            return { ...state, Processing: false, User: null, Message: null, }
        case 'LOGOUT_FAILED':
            return { ...state, Processing: false, Message: action.payload }

        case 'REGISTER_ATTEMP':
            return {
                ...state,
                Message: null,
                Processing: true,
            }
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                Processing: false,
                Message: "Register Done",
            }
        case 'REGISTER_FAILED':
            return { ...state, Processing: false, Message: action.payload }
        case 'LOADING_USER':
            return {
                ...state,
                Message: null,
                Processing: action.payload,
            }
        case 'UPDATEUSER_ATTEMP':
             return { ...state, Processing: true, Message: null, }
        case 'UPDATEUSER_SUCCESS':
             return { ...state, Processing: false, Message: 'Update User Done'}
        case 'UPDATEUSER_FAILED':
             return { ...state, Processing: false, Message: action.payload }
        case 'FORGETPWD_ATTEMP':
             return { ...state, Processing: true, Message: null, }
        case 'FORGETPWD_SUCCESS':
             return { ...state, Processing: false, Message: 'Forget Pwd Done'}
        case 'FORGETPWD_FAILED':
             return { ...state, Processing: false, Message: action.payload }
        case 'USERPROFILE_ATTEMP':
            return { ...state, Processing: true, Message: null, }
        case 'USERPROFILE_SUCCESS':
            return { ...state, 
                Processing: false,
                UserData: {
                    id: action.payload.id ,
                    first_name: action.payload.first_name,
                    last_name: action.payload.last_name,
                    email: action.payload.email,
                    photo: action.payload.photo,
                    phone: action.payload.phone,
                    points: action.payload.points,
                    city: action.payload.city,
                    lon: action.payload.lon,
                    lat: action.payload.lat,
                    user_type: action.payload.user_type,
                },
                 Message: 'Get Profile Done'}
        case 'USERPROFILE_FAILED':
            return { ...state, Processing: false, Message: action.payload }  
        case 'CATEGORY_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'CATEGORY_SUCCESS':
            return { ...state, Processing: false, Categories: action.payload }
        case 'CATEGORY_FAILED':
            return { ...state, Message: action.payload } 
        case 'DEALS_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'DEALS_SUCCESS':
            return { ...state, Processing: false, Deals: action.payload }
        case 'DEALS_FAILED':
            return { ...state, Message: action.payload } 
        case 'SUBCATEGORY_ATTEMP':
             return { ...state ,Message: null}
        case 'SUBCATEGORY_SUCCESS':
            return { ...state, SubCategories: action.payload}
        case 'SUBCATEGORY_FAILED':
            return { ...state, Message: action.payload }  
            
        case 'SELLERPRODUCT_ATTEMP':
            return { ...state ,Message: null,Processing: true }
        case 'SELLERPRODUCT_SUCCESS':
            return { ...state, Processing: false,Products: action.payload}
        case 'SELLERPRODUCT_FAILED':
            return { ...state, Processing: false,Message: action.payload }  

        case 'STORELOCATIONS_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'STORELOCATIONS_SUCCESS':
            return { ...state, Processing: false, StoresLocations: action.payload}
        case 'STORELOCATIONS_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'ADDPRODUCT_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'ADDPRODUCT_SUCCESS':
            return { ...state, Processing: false, Message: 'Add Product Done'}
        case 'ADDPRODUCT_FAILED':
            return { ...state, Processing: false , Message: action.payload }

        case 'GETPROFILE_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'GETPROFILE_SUCCESS':
            return { ...state, Processing: false, SellerData: action.payload}
        case 'GETPROFILE_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'ADDSTAFF_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'ADDSTAFF_SUCCESS':
            return { ...state, Processing: false, Message: 'Add Staff Done'}
        case 'ADDSTAFF_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'STATISTIC_ATTEMP':
            return { ...state ,Message: null}
        case 'STATISTIC_SUCCESS':
            return { ...state, Processing: false, Statistics: action.payload}
        case 'STATISTIC_FAILED':
            return { ...state, Processing: false , Message: action.payload }

        case 'PENDING_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'PENDING_SUCCESS':
            return { ...state, Processing: false, PendingOrders: action.payload}
        case 'PENDING_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'DELIVERED_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'DELIVERED_SUCCESS':
            return { ...state, Processing: false, DeliveredOrders: action.payload}
        case 'DELIVERED_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'GETSTAFF_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'GETSTAFF_SUCCESS':
            return { ...state, Processing: false, Staff: action.payload}
        case 'GETSTAFF_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'ADDDRIVER_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'ADDDRIVER_SUCCESS':
            return { ...state, Processing: false, Message: 'Add Driver Done'}
        case 'ADDDRIVER_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'GETDRIVER_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'GETDRIVER_SUCCESS':
            return { ...state, Processing: false, Drivers: action.payload}
        case 'GETDRIVER_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'REVENUE_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'REVENUE_SUCCESS':
            return { ...state, Processing: false, ProductRevenue: action.payload1 , RevenueData: action.payload2}
        case 'REVENUE_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'CHANGEPWD_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'CHANGEPWD_SUCCESS':
            return { ...state, Processing: false, Message: 'Change Password Done'}
        case 'CHANGEPWD_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'RESETPWD_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'RESETPWD_SUCCESS':
            return { ...state, Processing: false, Message: 'Reset Password Done'}
        case 'RESETPWD_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'ADDCUSTOMIZATION_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'ADDCUSTOMIZATION_SUCCESS':
            return { ...state, Processing: false, Message: 'Successfully Added'}
        case 'ADDCUSTOMIZATION_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'GETCUSTOMIZATION_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'GETCUSTOMIZATION_SUCCESS':
            return { ...state, Processing: false, Customizations: action.payload1 , Style: action.payload2}
        case 'GETCUSTOMIZATION_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'UPDATEPICTURE_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'UPDATEPICTURE_SUCCESS':
            return { ...state, Processing: false, Message: 'Successfully Updated'}
        case 'UPDATEPICTURE_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'DELPRODUCT_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'DELPRODUCT_SUCCESS':
            return { ...state, Processing: false, Message: 'Successfully Delete'}
        case 'DELPRODUCT_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'UPDATEPRODUCT_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'UPDATEPRODUCT_SUCCESS':
            return { ...state, Processing: false, Message: 'Product Updated'}
        case 'UPDATEPRODUCT_FAILED':
            return { ...state, Processing: false , Message: action.payload }
        case 'ASSIGN_ATTEMP':
            return { ...state ,Message: null,Processing: true}
        case 'ASSIGN_SUCCESS':
            return { ...state, Processing: false, Message: 'Driver Assigned to the order successfully'}
        case 'ASSIGN_FAILED':
            return { ...state, Processing: false , Message: action.payload }

        default:
            return state
    }
};