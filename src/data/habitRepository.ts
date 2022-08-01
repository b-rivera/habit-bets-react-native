import { firebase } from '../firebase/config';
import { utilities } from 'habit-bets-models'; //getDateKeyString } from "../utilities/dateParsing";
import { HabitFactory } from 'habit-bets-models';//'../models/habitFactory';
import { Habit } from 'habit-bets-models';//'../models/Habit';
import { getFirebaseFriendlyHabit, getFirebaseFriendlyObj } from '../utilities/firebaseParsing';

// Firebase Auth uid
var _userId:string;

var transformObjectsIntoHabits = (obj:object):Array<Habit> => {
  let habits:Array<Habit> = [];
  let habitFactory = new HabitFactory();

  if (obj === undefined || !obj) return habits;

  //console.log(obj);

  Object.values(obj).forEach(element => {
    habits.push(habitFactory.createHabit(element));
  });

  return habits;
}

export function initForUser(userId:string){
  _userId = userId;
}

//-------------------------------------------------------------
//-------------------------------------------------------------

export async function getHabits():Promise<Array<Habit>>{
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get latest values from the internal storage
    const activeRef = firebase.database().ref("/habits/" + _userId + "/active");
    let active:any = await activeRef.once("value").then((snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return undefined;
    });

    // Convert those values to Habits
    return transformObjectsIntoHabits(active);
  }
  catch(error){
    throw new Error("Failed to get user habits: " + error);
  }
}

export async function addHabit(habit:Habit){
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get latest values from the internal storage
    const activeRef = firebase.database().ref("/habits/" + _userId + "/active");
    let newRef = await activeRef.push();
    if (!newRef.key) throw "unable to get key for new habit";

    // Assign new id 
    habit.id = newRef.key;

    // Save new habit to db
    newRef.set(getFirebaseFriendlyHabit(habit));
  }
  catch(error){
    throw new Error("Failed to add habit: " + error);
  }
}

export async function copyActiveHabit(id:string) {
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get database reference
    const activeRef = firebase.database().ref("/habits/" + _userId + "/active");

    // Read in the value of existing habit
    let habitData = await activeRef.child(id).once("value");
    if (!habitData.exists()) throw "Habit does not exist";
    let habit = habitData.val();//JSON.parse(habitData.val());

    // Push new habit to get new id
    let newRef = await activeRef.push();
    if (!newRef.key) throw "unable to get key for new habit";

    // Assign new id and clear non-transferrable data
    habit.id = newRef.key;
    habit.dateCreated = new Date();
    habit.archivedDate = undefined;
    habit.status = "active";
    habit.checkins = {};

    // Save new habit to db
    newRef.set(getFirebaseFriendlyHabit(habit));
  }
  catch(error){
    throw new Error("Failed to copy active habit: " + error);
  }
}

export async function removeHabit(id:string){
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get database reference
    const habitRef = firebase.database().ref("/habits/" + _userId + "/active").child(id);

    // Read in the value of existing habit
    let habitData = await habitRef.once("value");
    if (!habitData.exists()) throw "Habit does not exist";

    // Remove habit to get new id
    await habitRef.remove();
  }
  catch(error){
    throw new Error("Failed to copy active habit: " + error);
  }
}

export async function updateHabit(id:string, newFields:any) {
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get database reference
    const habitRef = firebase.database().ref("/habits/" + _userId + "/active").child(id);

    // Read in the value of existing habit
    let habitData = await habitRef.once("value");
    if (!habitData.exists()) throw "Habit does not exist";
    //let habit = habitData.val();

    // Loop through new object and update existing
    // object if the key already exists, otherwise add it
    // firebase .update() could handle this
    // Object.entries(newFields).forEach(([key, value]) => {
    //   habit[key] = value;
    // });

    // Save new habit to db
    habitRef.update(getFirebaseFriendlyObj(newFields));
  }
  catch(error){
    throw new Error("Failed to copy active habit: " + error);
  }
}

export async function archiveActiveHabit(id:string){
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get database reference
    const habitRef = firebase.database().ref("/habits/" + _userId + "/active").child(id);

    // Read in the value of existing habit
    let habitData = await habitRef.once("value");
    if (!habitData.exists()) throw "Habit does not exist";

    // Move the habit to the archive list
    await addArchiveHabitWithKey(habitData.val()); // Don't JSON.parse on purpose

    // Delete habit from active list
    await habitRef.remove();
  }
  catch(error){
    throw new Error("Failed to archive habit: " + error);
  }
}

//-------------------------------------------------------------
//-------------------------------------------------------------

export function addDayCheckin(id:string, checkinDate:Date){
  // Find the item with the desired id
  addCheckin(id, checkinDate, 1);
}

export function clearDayCheckin(id:string, checkinDate:Date){
  // Find the item with the desired id
  addCheckin(id, checkinDate, 0);
  //addCheckin(id, checkinDate, -1);
}

export function skipDay(id:string, checkinDate:Date){
  // Find the item with the desired id
  addCheckin(id, checkinDate, -1);
}

export function addHourlyCheckin(id:string, checkinDate:Date, totalDailyHours:number){
  // Find the item with the desired id
  addCheckin(id, checkinDate, totalDailyHours);
}

async function addCheckin(id:string, checkinDate:Date, times:number){
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    //Get chackin key from date
    let checkinKey = utilities.getDateKeyString(checkinDate);

    // Get database reference
    const habitRef = firebase.database().ref("/habits/" + _userId + "/active/").child(id);

    // Read in the value of existing habit
    let habitData = await habitRef.once("value");
    if (!habitData.exists()) throw "Habit does not exist";
    let habit = habitData.val();//JSON.parse(habitData.val());

    // Determine what updates we need to make
    var updates:any = {};
    if (Object.prototype.hasOwnProperty.call(habit, 'checkins')){
      if (Object.prototype.hasOwnProperty.call(habit.checkins, checkinKey)) {
        // Setting to 0 should remove the key
        if (times == 0) // remove
          updates['/checkins/' + checkinKey] = null;
        else // set value
          updates['/checkins/' + checkinKey] = times;
      }                
      else if (times != 0) // add new key
        updates['/checkins/' + checkinKey] = times; 
    }
    else if (times != 0)  // add checkins object with new key
      updates['/checkins'] = {[checkinKey]: times};

    // Save changes to the object
    await habitRef.update(updates);
  }
  catch(error){
    throw new Error("Failed to add checkin: " + error);
  }
}

//-------------------------------------------------------------
//-------------------------------------------------------------

export async function getArchivedHabits(){
  if (!_userId) throw new Error("habit repository has not been initialized");

  try {
    // Get latest values from the internal storage
    const archiveRef = firebase.database().ref("/habits/" + _userId + "/archived");
    let archived = await archiveRef.once("value");

    // Convert those values to Habits
    return transformObjectsIntoHabits(archived.val());
  }
  catch(error){
    throw new Error("Failed to get user archived habits: " + error);
  }
}

async function addArchiveHabitWithKey(habit:any){
  try {
    if (!habit.id) throw "habit requires a key";

    // Set reference for the new habit in the archive list
    const archiveRef = firebase.database()
      .ref("/habits/" + _userId + "/archived/" + habit.id);

    // Save new habit to archive
    await archiveRef.set(habit);
  }
  catch(error){
    throw new Error("Failed to add habit: " + error);
  }
}

export async function copyArchivedHabit(id:string) {
  try {
    // Get database reference
    const archiveRef = firebase.database().ref("/habits/" + _userId + "/archived");

    // Read in the value of existing habit
    let habitData = await archiveRef.child(id).once("value");
    if (!habitData.exists()) throw "Archived Habit does not exist";
    let habit = habitData.val();//JSON.parse(habitData.val());

    // Push new habit to get new id
    const activeRef = firebase.database().ref("/habits/" + _userId + "/active");
    let newRef = await activeRef.push();
    if (!newRef.key) throw "unable to get key for new habit";

    // Assign new id and clear non-transferrable data
    habit.id = newRef.key;
    habit.dateCreated = new Date();
    habit.archivedDate = undefined;
    habit.status = "active";
    habit.checkins = {};

    // Save new habit to db
    newRef.set(getFirebaseFriendlyHabit(habit));
  }
  catch(error){
    throw new Error("Failed to copy active habit: " + error);
  }
}
