import { 
   GLOBAL_INIT,
   GLOBAL_CHANGE_NAME_TEACHER, 
   GLOBAL_TOGGLE_LOGGED

} from "../reducers/types"


export const changeNameTeacher = (name) => {
   return {
      type: GLOBAL_CHANGE_NAME_TEACHER,
      payload: name
   }
}

export const changeStateLogged = () => {
   return {
      type: GLOBAL_TOGGLE_LOGGED,
   }
}
export const initGlobal = initState => ({
   type: GLOBAL_INIT,
   payload: initState
})