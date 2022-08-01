import { AccountParams } from "../views/Account";
import { ArchiveParams } from "../views/ArchiveView";
import { EditHabitParams } from "../views/EditHabit";
import { FriendsParams } from "../views/Friends";
import { HabitDetailsParams } from "../views/HabitDetails";
import { HomeParams } from "../views/Home";
import { NewHabitParams } from "../views/NewHabit";

export type RootStackNavigationParams = 
    ArchiveParams & 
    HomeParams & 
    AccountParams & 
    HabitDetailsParams & 
    EditHabitParams & 
    FriendsParams &
    NewHabitParams;