import { GLOBAL_CHANGE_NAME, GLOBAL_TOGGLE_LOGGED } from "./types"

export const nameTeacher = (state = "Загрузка...", action) => {
   switch(action.type){
      case GLOBAL_CHANGE_NAME:
         return action.payload
      default:
         return state
   }
}
export const logged = (state = false, action) => {
   switch(action.type){
      case GLOBAL_TOGGLE_LOGGED:
         return !state.logged
      default:
         return state
   }
}
