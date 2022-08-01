import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { signInUser } from '../data/userRepository';
import { User } from 'habit-bets-models'; 

type LoginProps = {
  navigation: any
}

type LoginState = {
  email: string,
  password: string
}

export class Login extends React.Component<LoginProps, LoginState>{
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  onSignUpPressed = () => {
    this.props.navigation.navigate('RegisterRT', {});
  }

  cancelLogin = () => {
    Alert.alert('Login cancelled');
    this.props.navigation.navigate('HomeRT', {});
  }

  onLoginPress = () => {    
    signInUser(this.state.email, this.state.password)
      .then((newUser:User) => {
        this.props.navigation.navigate('HomeRT', {user: newUser});
      })
      .catch((error) => {
        alert(error);
      });
  } 
   
  componentDidMount(){    
    //console.log("componentDidMount (Login.tsx)");
  }

  render() {
    return (
      <View>      
        <View style={styles.topHeader}></View>
        <View style={styles.container}>
          {/* <Text style={styles.heading}>Login</Text> */}

          <Image
            style={styles.logo}
            source={require('../img/habitbets.png')}
          />

          <TextInput
            style={styles.inputs}
            placeholder='E-mail'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.inputs}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          /> 

          <TouchableOpacity onPress={this.onLoginPress} style={styles.submitButton}>
            <Text style = {styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.cancelLogin} style={styles.cancelButton}>
            <Text style = {styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>Don't have an account? <Text onPress={this.onSignUpPressed} style={styles.footerLink}>Sign up</Text></Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topHeader:{
    height: 23,
    backgroundColor: '#D8D8D8',
  },
  container:{
    flex:1,
    alignItems: 'center'
    //paddingBottom: '45%',
    //paddingTop:'10%'
  },
  heading:{
    //flex:1,
    fontSize:16,
    paddingBottom: 10
  },
  logo: {
    //flex: 1,
    height: 120,
    width: 120,
    alignSelf: "center",
    margin: 30
  },
  inputs:{
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    width: '80%',
    marginVertical: 10,
    paddingLeft:12
  },
  submitButton:{
    backgroundColor: '#788eec',
    width: '80%',
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  cancelButton:{
    backgroundColor: '#A8A8A8',
    width: '80%',
    marginTop: 10,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  footerText: {
      fontSize: 16,
      color: '#2e2e2d'
  },
  footerLink: {
      color: "#788eec",
      fontWeight: "bold",
      fontSize: 16
  }
});