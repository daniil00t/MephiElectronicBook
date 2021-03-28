import {
   NOTIF_SHOW,
   NOTIF_CLOSE

} from "./types"

export const notifier = (state = {
   visible: false,
   title: "",
   content: ""
}, action) => {
   switch(action.type){
      case NOTIF_SHOW:
         return {
            ...state,
            visible: true,
            title: action.payload.title,
            content: action.payload.content,
            type: action.payload.type
         }
      case NOTIF_CLOSE:
         return {
            ...state,
            visible: false
         }
      default:
         return state
   }
}