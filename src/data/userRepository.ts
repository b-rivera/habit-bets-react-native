import { firebase } from '../firebase/config';
import { User } from 'habit-bets-models';

var loggedInUserID:string;

export async function getUserProfile(uid:string):Promise<User> {
  if (!uid) 
    throw new Error("Cannot retrieve profile without user id");

  const usersRef = firebase.database().ref("/users");
  let profile = await usersRef.child(uid).once("value");

  if (!profile.exists())
    throw new Error("User profile does not exist");

  let user = profile.val();
  return new User(user.uid, user.email, user.fullName);
}

export async function getProfileForCurrentUser():Promise<User> {
  if (!loggedInUserID) 
    throw new Error("Cannot retrieve profile without user id");

  return await getUserProfile(loggedInUserID);
}

export async function getFriendsForCurrentUser():Promise<Array<User>> {
  if (!loggedInUserID) 
    throw new Error("Cannot retrieve profile without user id");

  // Get list of friends for user
  const usersRef = firebase.database().ref("/users/" + loggedInUserID);
  let friendSnap = await usersRef.child("friends").once("value");

  if (!friendSnap.exists()) return [];
  let friends = friendSnap.val();

  // query profile for each user and push to array
  var friendArray = [];
  for (let elem in friends) {
    if (!friends[elem]) continue;
    let friendProfile = await getUserProfile(elem);
    friendArray.push(new User(friendProfile.uid, friendProfile.email, friendProfile.fullName));
  }

  return friendArray;
}

export function registerAuthStateChangedHandler(handler: (err:string, user?:User) => void) {
  firebase.auth().onAuthStateChanged(fbUser => {
    if (!fbUser)
      return handler("", undefined);

    loggedInUserID = fbUser.uid;
    
    getUserProfile(fbUser.uid)
      .then((userProfile) => {
        return handler("", userProfile);
      })
      .catch((error) => {
        return handler("Failed to retrieve user profile: " + error, undefined);
      })
  });
}

export async function registerNewUser(fullName:string, email:string,
  password:string, passwordConfirm:string):Promise<User> {
  if (password !== passwordConfirm)
    throw new Error("Passwords must match");
  
  try {
    // Setup Account in Authentication table
    let response = await firebase.auth().createUserWithEmailAndPassword(email, password); 
    if (!response.user) throw "empty user returned";

    // Write additional user data to user table
    const user = new User(response.user.uid, email, fullName);
    const usersRef = firebase.database().ref("/users/" + response.user.uid);
    await usersRef.set(user)
    
    // Return the user if no errors till this point
    return user;
  }
  catch(error){
    throw new Error("Failed to register user: " + error);
  }
}

export async function signInUser(email:string, password:string):Promise<User> {    
  if (email == "")
    throw new Error("Email cannot be empty.")
  if (password == "")
    throw new Error("Password cannot be empty.")  

  try {
    // Get UID for user associated with signin
    let response = await firebase.auth().signInWithEmailAndPassword(email, password);
    if (!response.user) throw "empty user returned";
    
    // Pull additional user information from Users table
    const userRef = firebase.database().ref("/users").child(response.user.uid);
    let userData = await userRef.once("value");
    if (!userData.exists()) throw "User profile does not exist";

    // Return user object
    let user = userData.val();
    return new User(user.uid, user.email, user.fullName);
  }
  catch(error){
    throw new Error("Failed to sign in: " + error);
  }
} 

export async function signOutUser(){
  firebase.auth().signOut()
}