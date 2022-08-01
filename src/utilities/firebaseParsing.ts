import { Habit } from 'habit-bets-models'; //"../models/Habit";

export function getFirebaseFriendlyHabit(habit:Habit):any{
  let _habit = habit as any; //bypass typechecking

  // Remove functions
  if (_habit.hasOwnProperty('getPeriodStartDate'))
    delete _habit.getPeriodStartDate;
  if (_habit.hasOwnProperty('calculateCheckinTotalForPeriod'))
    delete _habit.calculateCheckinTotalForPeriod;
  if (_habit.hasOwnProperty('retrieveTodaysCheckinValue'))
    delete _habit.retrieveTodaysCheckinValue;
  if (_habit.hasOwnProperty('getCheckinTotalForPeriod'))
    delete _habit.getCheckinTotalForPeriod;
  if (_habit.hasOwnProperty('getTodaysCheckinValue'))
    delete _habit.getTodaysCheckinValue;

  // Convert dates and undefined's
  return getFirebaseFriendlyObj(_habit);
}

export function getFirebaseFriendlyObj(obj:any){
    // Clean up objects for database
    Object.keys(obj).forEach((key) => {
      // Firebase does not like Date objects, convert to string
      if(obj[key] instanceof Date)
        obj[key] = obj[key].toLocaleString();
      // Firebase does not like undefined, switch to null (these will be removed)
      if(obj[key] == undefined)
        obj[key] = null;
    });

    return obj;
}