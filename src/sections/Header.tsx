import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faPlusSquare, faQuestionCircle, faFileArchive, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { User } from 'habit-bets-models';

type HeaderProps = {
  title: string,
  user?: User,
  navigate: any,
  showActive: () => void,
  showArchive: () => void
}

type HeaderState = {
  isArchive:boolean
}

export class Header extends React.Component<HeaderProps,HeaderState> {
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
      isArchive: false
    }
  }

  _showActive = () => {
    this.props.showActive();
    this.setState({
      isArchive: false
    });
  }

  _showArchive = () => {
    this.props.showArchive();
    this.setState({
      isArchive: true
    });
  }

  render() {
    let isLoggedIn = this.props.user ? true : false;
    return (
      <View style={styles.headContainerStyle}>
        <Image
          style={styles.iconStyle}
          source={require('../img/habitbets.png')}
        />
        <View style={styles.headBarStyle}>
          <Text style={styles.logoStyle}>{this.props.title}</Text>          
          {( !this.state.isArchive && 
            <TouchableHighlight style={styles.headerTouchableStyle} 
              onPress={this._showArchive}>
              <FontAwesomeIcon size={30} icon={faFileArchive} style={styles.headerIconStyle}/>
            </TouchableHighlight>
          )}       
          {( this.state.isArchive && 
            <TouchableHighlight style={styles.headerTouchableStyle} 
              onPress={this._showActive}>
              <FontAwesomeIcon size={30} icon={faCalendarAlt} style={styles.headerIconStyle}/>
            </TouchableHighlight>
          )}
          { isLoggedIn ? ( 
              <TouchableHighlight style={styles.headerTouchableStyle}
                onPress={() => this.props.navigate('AccountRT', {user: this.props.user})}>
                <FontAwesomeIcon size={30} icon={faUserCircle}/>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight style={styles.headerTouchableStyle}>
                <FontAwesomeIcon size={35} icon={faQuestionCircle} style={styles.headerIconStyle}/>
              </TouchableHighlight>
            )
          }
          {( !this.state.isArchive && 
            <TouchableHighlight style={styles.headerTouchableStyle} 
              onPress={() => this.props.navigate('NewHabitRT')}>
              <FontAwesomeIcon size={30} icon={faPlusSquare} style={styles.headerIconStyle}/>
            </TouchableHighlight>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({  
  iconStyle:{
    width: 40,
    height: 40,
    marginTop: 3,
    marginLeft: 5,
  },
  headerTouchableStyle:{
    marginLeft:12
  },
  headerIconStyle:{
    color: '#fff'
  },
  headContainerStyle: {
    //flex:1,
    flexDirection: 'row',
    marginTop: 23,
    backgroundColor: '#1e75ff',
    height:48,
    borderBottomWidth: 2,
    borderColor: '#000000',
    fontFamily: "sans-serif"
  },
  headBarStyle: {    
    padding: 10,
    flex:1,//7,
    flexDirection: 'row'
  },
  logoStyle:{
    flex:1,
    textAlign: 'left',
    color: '#ffffff',
    fontSize: 20
  }
});