import React from 'react';
import { Home } from './src/views/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { ArchiveView } from './src/views/ArchiveView';
import { NewHabit } from './src/views/NewHabit';
import { HabitDetails } from './src/views/HabitDetails';
import { EditHabit } from './src/views/EditHabit';
import { Login } from './src/views/Login';
import { Register } from './src/views/Register';
import { Account } from './src/views/Account';
import { Friends } from './src/views/Friends';
import { StyleSheet, View, TouchableOpacity, Image,TouchableHighlight, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props:any) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={styles.drawerHeadStyle}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={require('./src/img/habitbets.png')}
          style={styles.drawerHeadImgStyle}
        />
      </TouchableOpacity>
    </View>
  );
};

// Route Navigator maps screens to each route
function activeRoutes({navigation}:any) {
  return (
    <Stack.Navigator initialRouteName="HomeRT"
      /*screenOptions applies to all screens*/
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: styles.navHeaderStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.navHeaderTitleStyle,        
      }}>

      <Stack.Screen name="HomeRT" component={Home} 
        options={({navigation}:any) => ({
          title: 'Active Habits',
          headerRight: () => (
            <TouchableHighlight style={styles.headerTouchableStyle} 
              onPress={() => navigation.navigate('NewHabitRT')}>
              <View>
                <FontAwesomeIcon size={30} icon={faPlusSquare} style={styles.headerIconStyle}/>
              </View>
            </TouchableHighlight>
          )
        })}
      />
      <Stack.Screen name="NewHabitRT" component={NewHabit} options={{title: 'New Habit'}}/>
      <Stack.Screen name="HabitDetailsRT" component={HabitDetails} options={{title: 'Habit Details'}}/>
      <Stack.Screen name="EditHabitRT" component={EditHabit} options={{title: 'Edit Habits'}}/>
      <Stack.Screen name="LoginRT" component={Login} options={{title: 'Login'}}/>
      <Stack.Screen name="RegisterRT" component={Register} options={{title: 'Register'}}/>
    </Stack.Navigator>
  )
}

function archiveRoutes({navigation}:any) {
  return (
    <Stack.Navigator initialRouteName="ArchiveRT"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: styles.navHeaderStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.navHeaderTitleStyle,
      }}>

      <Stack.Screen name="ArchiveRT" component={ArchiveView} options={{title: 'Archived Habits'}}/>
      <Stack.Screen name="HabitDetailsRT" component={HabitDetails} options={{title: 'Habit Details'}}/>
    </Stack.Navigator>
  )
}

function friendsRoutes({navigation}:any) {
  return (
    <Stack.Navigator initialRouteName="FriendsRT"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: styles.navHeaderStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.navHeaderTitleStyle,
      }}>

      <Stack.Screen name="FriendsRT" component={Friends} options={{title: 'Friends'}}/>
    </Stack.Navigator>
  )
}

function accountRoutes({navigation}:any) {
  return (
    <Stack.Navigator initialRouteName="AccountRT"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: styles.navHeaderStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.navHeaderTitleStyle,
      }}>

      <Stack.Screen name="AccountRT" component={Account} options={{title: 'My Account'}}/>
    </Stack.Navigator>
  )
}

let statusBarHeight = (StatusBar.currentHeight??40)- 5;

function App() {
  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="HomeRT"
            options={{
              drawerLabel: 'Active Habits'
            }}
            component={activeRoutes}
          />
          <Drawer.Screen
            name="ArchiveRT"
            options={{
              drawerLabel: 'Archived'
            }}
            component={archiveRoutes}
          />
          <Drawer.Screen
            name="FriendsRT"
            options={{
              drawerLabel: 'Friends'
            }}
            component={friendsRoutes}
          />
          <Drawer.Screen
            name="AccountRT"
            options={{
              drawerLabel: 'Account'
            }}
            component={accountRoutes}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  )
};

const styles = StyleSheet.create({
  drawerHeadStyle: {
    fontFamily: "sans-serif",
    flexDirection: "row"
  },
  drawerHeadImgStyle: { 
    width: 40, 
    height: 40, 
    marginTop: 3, 
    marginLeft: 5 
  },
  navHeaderStyle: {
    backgroundColor: '#000',
  },
  navHeaderTitleStyle: {
    fontWeight: 'bold'
  },
  headerTouchableStyle:{
    marginHorizontal:10,
    marginTop: 3
  },
  headerIconStyle:{
    color: '#fff'
  }
});

export default App;