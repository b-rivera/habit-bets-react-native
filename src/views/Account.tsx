import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { User } from 'habit-bets-models'; //'../models/User';
import { signOutUser } from '../data/userRepository';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { getProfileForCurrentUser } from '../data/userRepository';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type AccountParams = {
  AccountRT : {
    refresh?:boolean;
    user?:any; //User
  }
}

type AccountProps = {
  navigation: StackNavigationProp<RootStackNavigationParams, "AccountRT">,
  route: RouteProp<RootStackNavigationParams, "AccountRT">
}

type AccountState = {
  user?: User
}

export class Account extends React.Component<AccountProps, AccountState>{ 
  constructor(props: AccountProps) {
    super(props)
    this.state = {
      user: undefined
    };
  }

  cancelRegister = () => {
    this.props.navigation.navigate('HomeRT', {});
  }

  onLogOutPress = () => {
    let _navigate = this.props.navigation.navigate;
    signOutUser()
      .then(function() {
        _navigate('HomeRT', {}); //Go back Home
      })
      .catch(function(error) {        
        alert("Failed to log out: " + error); // An error happened.
      });
  }

  async componentDidMount() {
    let userProfile = await getProfileForCurrentUser();
    this.setState({
      user: userProfile
    });
  }

  render() {
    return (
      <View> 
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../img/habitbets.png')}
          />

          <Text style={styles.labels}>{this.state.user?.fullName}</Text>
          <Text style={styles.labels}>{this.state.user?.email}</Text>

          <TouchableOpacity onPress={this.onLogOutPress} style={styles.submitButton}>
            <Text style = {styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    paddingTop: '10%'
  },
  heading:{
    fontSize:16,
    paddingBottom: 10
  },
  logo: {
    //flex: 1,
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 20
  },
  labels:{
    fontSize:16,
    alignSelf: "center",
    marginVertical: 10
  },
  submitButton:{
    backgroundColor: '#788eec',
    width: '60%',
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  }
});