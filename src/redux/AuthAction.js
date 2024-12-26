
export const signin = (data)=>{
    return{
        type:"SIGNIN",
        payload:data
    }
}

export const signout = ()=>{
    return{
        type:"SIGNOUT",
    }
}

