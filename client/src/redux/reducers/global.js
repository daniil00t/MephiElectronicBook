import { 
   GLOBAL_INIT,
   GLOBAL_CHANGE_NAME_TEACHER, 
   GLOBAL_TOGGLE_LOGGED
} from "./types"

let startState = {
   nameTeacher: "Загрузка...", 
   linkOnHomeMephi: "http://home.mephi.ru/",
   isLogged: false,
   countSubject: 0,
   countGroups: 0
}

export const GLOBAL = (state = startState, action) => {
   switch(action.type){
      case GLOBAL_CHANGE_NAME_TEACHER:
         return {
            ...state,
            nameTeacher: action.payload
         }
      case GLOBAL_TOGGLE_LOGGED:
         return {
            ...state,
            isLogged: !state.isLogged
         }
      case GLOBAL_INIT:
         return {
            ...state,
            ...action.payload
         }
      default:
         return state
   }
}