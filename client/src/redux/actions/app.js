import { 
   NOTIF_SHOW, 
   NOTIF_CLOSE 
} from "../reducers/types"

export const showNotification = (payload) => {
   return {
      type: NOTIF_SHOW,
      payload: {
         title: payload.title,
         content: payload.content,
         type: payload.type
      }
   }
}
export const closeNotification = () => {
   return {
      type: NOTIF_CLOSE
   }
}