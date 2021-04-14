import { 
   NOTIF_SHOW, 
   NOTIF_CLOSE 
} from "../reducers/types"

let startState = {
   notification: {
      visible: false,
      title: "",
      content: ""
   },
   authToken: "",
   publicToken: ""
}

export const app = (state = startState, action) => {
   switch(action.type){
      case NOTIF_SHOW:
         return {
            ...state,
            notification: {
               visible: true,
               title: action.payload.title,
               content: action.payload.content,
               type: action.payload.type
            }  
         }
      case NOTIF_CLOSE:
         console.log('close')
         return {
            ...state,
            notification: {
               visible: false,
               title: "",
               content: "",
               type: ""
            }
            
         }
      default:
         return state
   }
}