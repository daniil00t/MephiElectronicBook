import { 
   SCHEDULE_SET_SCHEDULE
} from "../reducers/types"

export const setSchedule = schedule => ({
   type: SCHEDULE_SET_SCHEDULE,
   payload: schedule
})
