import { SCHEDULE_SET_SCHEDULE } from "./types"

const addUniqueItem = (items, arr) => {
   items.map(item => { if(arr.indexOf(item) === -1)  arr.push(item); return item })
   return arr
}


const subjectToGroup = schedule => {
   let result = []
   schedule.map(day => {
      day.map((lesson, index) => {
         // Add compact array subject -> (name, groups, durations, types)
         let tmpNames = result.reduce((acc, cur) => {
            return [...acc, cur.name]
         }, [])

         let indexName = tmpNames.indexOf(lesson.name)
         if(indexName !== -1){
            result[indexName].groups = addUniqueItem(lesson.groups, result[indexName].groups)
            result[indexName].durations = addUniqueItem([lesson.duration], result[indexName].durations)
            result[indexName].types = addUniqueItem([lesson.type], result[indexName].types)
         }else{
            result.push({
               name: lesson.name,
               groups: [...lesson.groups],
               durations: [lesson.duration],
               types: [lesson.type]
            })
         }
         return lesson;
      })
      return day;
   })

   return result
}

const groupToSubject = schedule => {
   let result = []
   schedule.map(day => {
      day.map((lesson, index) => {

         lesson.groups.map((group) => {
            let tmpGroups = result.reduce((acc, cur) => {
               return [...acc, cur.group]
            }, [])
            let indexGroup = tmpGroups.indexOf(group)
            if(indexGroup === -1){
               result.push({
                  group: group,
                  subjects: [lesson.name],
                  durations: lesson.duration,
                  types: [lesson.type]
               })
            }
            else{
               result[indexGroup].subjects = addUniqueItem([lesson.name], result[indexGroup].subjects)
               result[indexGroup].types = addUniqueItem([lesson.type], result[indexGroup].types)
            }
            return group
         })
         return lesson
      })
      return day
   })

   return result
}
const initialState =  {
   data: [],
   subjectToGroup: [],
   groupToSubject: []
}

export const scheduler = (state = initialState, action) => {
   switch(action.type){
      case SCHEDULE_SET_SCHEDULE:
         return {
            ...state,
            data: action.payload,
            subjectToGroup: subjectToGroup(action.payload),
            groupToSubject: groupToSubject(action.payload)
         }
      default:
         return state
   }
}