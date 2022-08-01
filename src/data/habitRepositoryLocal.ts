// import { Habit } from "../models/Habit";
// import { getDateKeyString } from "../utilities/dateParsing";
// import { AsyncStorage } from 'react-native';
// import { HabitFactory } from '../models/habitFactory';
// const util = require('util');

// var _active:Array<any> = [];
// var _archive:Array<any> = [];

// // 'habits' or 'archived'
// var queryAsyncStorage = async (source:string) => {
//     const habitList = await AsyncStorage.getItem(source);
//     if (habitList){
//         //console.log("Set db from AsyncStorage");
//         return JSON.parse(habitList);        
//     }
//     else
//         return [];        
// }

// //------------------------------------------------------------------
// //------------------------------------------------------------------

// var generateId = () => {
//     let lastId = "";

//     if (_active && _active.length > 0 && _active[_active.length-1].hasOwnProperty('id'))
//         lastId = _active[_active.length-1].id;

//     return (parseInt(lastId, 10) + 1).toString()
// }

// var transformObjectsIntoHabits = (obj:object) => {
//     let habitFactory = new HabitFactory();
//     return _active.map((obj) => habitFactory.createHabit(obj));
// }

// export async function getHabits(){
//     // Get latest values from the internal storage
//     _active = await queryAsyncStorage('habits');

//     //console.log(_active);
//     // Convert those values to Habits
//     return transformObjectsIntoHabits(_active);
// }

// export function addHabit(habit:Habit){
//     habit.id = generateId();
//     _active.push(habit);
//     // Push the latest to storage
//     AsyncStorage.setItem('habits', JSON.stringify(_active));
// }

// // Need type better type definition
// function pushCopyOfHabit(habit:any){
//     console.log("Pushing copy of habit '" + habit.name + "'");

//     //Get new ID, clear out used values
//     habit.id = generateId();
//     habit.dateCreated = new Date();
//     habit.archivedDate = undefined;
//     habit.status = "active";
//     habit.checkins = {};

//     // Push habit to local list
//     _active.push(habit);
    
//     // Push the latest to storage
//     AsyncStorage.setItem('habits', JSON.stringify(_active));

//     console.log("Habit copy completed");
// }

// export function copyArchivedHabit(id:string):boolean{
//     console.log("About to create copy of archived habit id:" + id);
//     let habit;
//     // Find the item with the desired id
//     for (var index = 0; index <_archive.length; index++) {
//         if (_archive[index].id === id){
//             habit = _archive[index];
//             break;
//         }            
//     }

//     if (!habit) return false;
//     pushCopyOfHabit(habit);
//     return true;
// }

// export function copyExistingHabit(id:string){
//     console.log("About to create copy of existing habit id:" + id);
//     let habit;
//     // Find the item with the desired id
//     for (var index = 0; index <_active.length; index++) {
//         if (_active[index].id === id){
//             habit = _active[index];
//             break;
//         }            
//     }

//     if (!habit) return false;
//     pushCopyOfHabit(habit);
//     return true;
// }

// export function removeHabit(id:string){
//     let dIndex = -1;
//     for (var index = 0; index <_active.length; index++) {
//         if (_active[index].id === id){
//             dIndex = index;
//             break;
//         }            
//     }

//     if (dIndex > 0){
//         _active.splice(dIndex,1);
//         console.log("Removing: " + _active);        
//         // Push the latest to storage
//         AsyncStorage.setItem('habits', JSON.stringify(_active));
//     }
// }

// export function updateHabit(id:string, newFields:object){
//     let updated = false;
//     // Find the item with the desired id
//     for (var index = 0; index <_active.length; index++) {
//         // if object found try to update
//         if (_active[index].id === id){
//             // Loop through new object and update existing
//             // object if the key already exists, otherwise add it
//             Object.entries(newFields).forEach(([key, value]) => {
//                 _active[index][key] = value;
//                 updated = true;
//             });
//             break;
//         }            
//     }

//     // Push the latest to storage
//     if (updated)
//         AsyncStorage.setItem('habits', JSON.stringify(_active));
// }

// //------------------------------------------------------------------
// //------------------------------------------------------------------

// var generateArchivedId = ():string => {
//     let lastId = "";

//     if (_archive && _archive.length > 0 && _archive[_archive.length-1].hasOwnProperty('id'))
//         lastId = _archive[_archive.length-1].id;
    
//     return (parseInt(lastId, 10) + 1).toString()
// }

// export async function getArchivedHabits(){
//     // Get latest values from the internal storage
//     _archive = await queryAsyncStorage('archived');

//     // Convert those values to Habits
//     return transformObjectsIntoHabits(_archive);
// }

// function addArchiveHabit(habit:Habit){
//     habit.id = generateArchivedId();
//     habit.archivedDate = new Date();
//     _archive.push(habit);
//     // Push the latest to storage
//     AsyncStorage.setItem('archived', JSON.stringify(_archive));
// }

// export function archiveActiveHabit(id:string){
//     let dIndex = -1;
//     for (var index = 0; index <_active.length; index++) {
//         // if object found try to update
//         if (_active[index].id === id){
//             // Add the habit to the archive list
//             addArchiveHabit(_active[index]);
//             dIndex = index;
//             break;
//         }            
//     }
    
//     // Delete it from the active list
//     if (dIndex > 0){
//         _active.splice(dIndex,1);
//         console.log("Removing: " + _active);        
//         // Push the latest to storage
//         AsyncStorage.setItem('habits', JSON.stringify(_active));
//     }
// }

// //------------------------------------------------------------------
// //------------------------------------------------------------------

// export function addDayCheckin(id:string, checkinDate:Date){
//     // Find the item with the desired id
//     addCheckin(id, checkinDate, 1);
// }

// export function clearDayCheckin(id:string, checkinDate:Date){
//     // Find the item with the desired id
//     addCheckin(id, checkinDate, 0);
//     //addCheckin(id, checkinDate, -1);
// }

// export function skipDay(id:string, checkinDate:Date){
//     // Find the item with the desired id
//     addCheckin(id, checkinDate, -1);
// }

// export function addHourlyCheckin(id:string, checkinDate:Date, totalDailyHours:number){
//     // Find the item with the desired id
//     addCheckin(id, checkinDate, totalDailyHours);
// }

// function addCheckin(id:string, checkinDate:Date, times:number){
//     //console.log("Trying to add checkin: " + checkinDate);
//     // Find the item with the desired id
//     let updated = false;
//     let checkinKey = getDateKeyString(checkinDate);
//     for (var index = 0; index < _active.length; index++) {
//         // if object found try to update
//         if (_active[index].id === id){
//             if (Object.prototype.hasOwnProperty.call(_active[index], 'checkins')){
//                 if (Object.prototype.hasOwnProperty.call(_active[index].checkins, checkinKey)) {
//                     // Setting to 0 will remove the key
//                     if (times == 0)
//                         delete _active[index].checkins[checkinKey]
//                     else
//                         _active[index].checkins[checkinKey] = times;
//                     updated = true;
//                 }                
//                 else if (times != 0){
//                     if (!_active[index].checkins)
//                         _active[index].checkins = {};

//                     _active[index].checkins[checkinKey] = times;
//                     updated = true;
//                 }                
//             }
//             break;
//         }            
//     }

//     //console.log("Saving changes to db:");
//     //console.log(util.inspect(_active[index], { compact: false, depth: 5}));

//     // Push the latest to storage
//     if (updated)
//         AsyncStorage.setItem('habits', JSON.stringify(_active));
// }


// // Data model sample
// const DB = {
//     users: {
        
//     },
//     habits: {
//         brivera: {
//             active: {
//                 1: {
//                     id:1,
//                     period: "week",
//                     status: 'active',
//                     penalty: 1.00,
//                     checkins: { 
//                         '2020-05-10': 1, 
//                         '2020-05-11': 1,
//                         '2020-05-12': 1,
//                     }
//                 }
//             },
//             archived: {
//                 2: {
//                     id:2,
//                     period: "week",
//                     status: 'active',
//                     penalty: 1.00,
//                     checkins: { 
//                         '2020-05-10': 1, 
//                         '2020-05-11': 1,
//                         '2020-05-12': 1,
//                     }
//                 }
//             }
//         }
//     }
// }