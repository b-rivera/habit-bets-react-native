import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { registerNewUser } from '../data/userRepository';
import { User } from 'habit-bets-models'; 

type RegisterProps = {
  navigation: any
}

type RegisterState = {
  fullName: string,
  email: string,
  password: string,
  passConfirm: string
}

export class Register extends React.Component<RegisterProps, RegisterState>{
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      fullName: '',
      email: '',
      password: '',
      passConfirm: ''
    }
  }

  onLoginPressed = () => {
    this.props.navigation.navigate('LoginRT', {});
  }

  cancelRegister = () => {
    this.props.navigation.navigate('HomeRT', {});
  }

  onRegisterPress = () => {
    registerNewUser(this.state.fullName, this.state.email, 
      this.state.password, this.state.passConfirm)
      .then((newUser:User) => {
        this.props.navigation.navigate('HomeRT', {user: newUser});
      })
      .catch((error) => {
        alert(error);
      });
  }

  render() {
    return (
      <View>      
        <View style={styles.topHeader}></View>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../img/habitbets.png')}
          />

          <TextInput
            style={styles.inputs}
            placeholder='Full Name'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => this.setState({fullName: text})}
            value={this.state.fullName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
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

          <TextInput
            style={styles.inputs}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => this.setState({passConfirm: text})}
            value={this.state.passConfirm}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <TouchableOpacity onPress={this.onRegisterPress} style={styles.submitButton}>
            <Text style = {styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.cancelRegister} style={styles.cancelButton}>
            <Text style = {styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <View style={styles.footerView}>
            <Text style={styles.footerText}>Already got an account? <Text onPress={this.onLoginPressed} style={styles.footerLink}>Log in</Text></Text>
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
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 20
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