
const initialState = {
    signin:false,
    data:null,
}

const AuthReducer = (state=initialState,action)=>{
    switch (action.type) {
        case "SIGNIN":
            return{
                ...state,
                signin:true,
                data:action.payload
            }  
        case "SIGNOUT" :
            return{
                ...state,
                signin:false,
                data:null
            }
        default: 
            return state;
    }
}

export default AuthReducer;