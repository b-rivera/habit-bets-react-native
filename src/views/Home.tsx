import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Active } from '../sections/Active';
import { Login } from './Login';
import { User } from 'habit-bets-models'; 
import { registerAuthStateChangedHandler } from '../data/userRepository';
import { initForUser } from '../data/habitRepository';
import { Loading } from './Loading';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type HomeParams = {
  HomeRT : {
    refresh?:boolean;
    user?:any; //User
  }
}

type HomeProps = {
  navigation: StackNavigationProp<RootStackNavigationParams, "HomeRT">,
  route: RouteProp<RootStackNavigationParams, "HomeRT">
}

type HomeState = {
  user?:any,
  isLoading:boolean,
  isArchive:boolean
}

export class Home extends React.Component<HomeProps, HomeState> {  
  constructor(props: HomeProps) {
    super(props)
    
    this.state = {
      user: this.props.route.params?.user,
      isLoading:true,
      isArchive:false
    };
  }

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  };

  initDbForNewUser = (user?:User) => {
    if (user)
      initForUser(user.uid);
  }

  onAuthUserChanged = (err:string, user?:User) => {
    if (err){
      return;
    }

    this.initDbForNewUser(user);

    this.setState({
      user: user,
      isLoading:false
    });
  }

  componentDidMount() {
    // Register to get user changes
    registerAuthStateChangedHandler(this.onAuthUserChanged);
  }

  showActive = () => {
    this.setState({
      isArchive: false
    });
  }

  showArchive = () => {
    this.setState({
      isArchive: true
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    let doRefresh = this.props.route.params?.refresh || false;
    return (
      <View style={styles.container}>
        { !this.state.isLoading && (
          <View style={styles.container}>
            { this.state.user ? (
                <View style={styles.container}>
                  <Active navigation={this.props.navigation} refresh={doRefresh}/>
                </View>
              ) : (
                <View style={styles.container}>
                  <Login navigation={this.props.navigation}/>
                </View>
              )
            }
          </View>
        )}
        { this.state.isLoading && (
          <View style={styles.container}>
            <Loading />
          </View>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
  }
});