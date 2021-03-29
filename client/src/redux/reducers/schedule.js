import { SCHEDULE_SET_SCHEDULE } from "./types"

export const scheduler = (state = {data: []}, action) => {
   switch(action.type){
      case SCHEDULE_SET_SCHEDULE:
         return {
            ...state,
            data: action.payload
         }
      default:
         return state
   }
}