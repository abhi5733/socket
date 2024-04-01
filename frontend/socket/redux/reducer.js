import { Name } from "./actionType"

const initialState = {name:""}

export const reducer = (state=initialState,action)=>{

    switch(action.type){

        case  Name :
            return  {...state , name : action.payload}


         default :
         return state   



    }


}