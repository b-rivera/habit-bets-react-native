import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import NumericInput from 'react-native-numeric-input';

type Props = {
  navigate: any,
  checkinHours: number,
  onCancel: () => void,
  onSave: (key:number) => void
}

type State = {  
  checkinHours: number,
  isSkipped: boolean
}

export class HourlyModal extends React.Component<Props, State> {
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)
    this.state = {
      checkinHours: (this.props.checkinHours >= 0) ? this.props.checkinHours : 0,
      isSkipped: props.checkinHours < 0
    }
  }
  
  updateHours = (latestHours:number) => {
    if (latestHours < 0) return;
    if (this.state.isSkipped) return; //Disable if skipped

    this.setState({
      checkinHours: latestHours
    })
  }

  toggleSkipped = (value:boolean) => {
    // If day skipped, reset hours to 0 (this will be -1 in db)
    this.setState({
      isSkipped: value,
      checkinHours: (value) ? 0 : this.state.checkinHours
    })
  }
  
  cancelModal = () => {
    this.props.onCancel();
  }

  callOnSave=()=>{
    let newValue = 0;
    if (this.state.isSkipped) newValue = -1;
    else newValue = this.state.checkinHours;

    this.props.onSave(newValue);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.panel}>
          <View style={styles.row}>
            <Text style={styles.title}>Hours:</Text>
            { !this.state.isSkipped &&
              <NumericInput 
                initValue={this.state.checkinHours} 
                value={this.state.checkinHours} 
                onChange={value => this.updateHours(value)} 
                minValue={0}
                valueType='integer'
                totalWidth={100}
                totalHeight={40}
                leftButtonBackgroundColor={(this.state.isSkipped) ? "#A9A9A9" : "white"}              
                rightButtonBackgroundColor={(this.state.isSkipped) ? "#A9A9A9" : "white"}
                rounded />  
            }
            { this.state.isSkipped && 
             <Text style={styles.title}>{this.state.checkinHours}</Text>
            }
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Day Skipped?</Text>
            <Switch
              style={{ marginLeft: 15, transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
              onValueChange = {this.toggleSkipped}
              value = {this.state.isSkipped}/>
          </View>
          <View style={styles.row}>  
            <TouchableHighlight onPress={this.cancelModal} underlayColor='#D3D3D3'>
              <View style={styles.buttons}>
                <FontAwesomeIcon size={30} icon={faTimesCircle}/>                
              </View>
            </TouchableHighlight>  
            <TouchableHighlight onPress={this.callOnSave} underlayColor='#D3D3D3'>
              <View style={styles.buttons}>
                <FontAwesomeIcon size={30} icon={faSave}/>                
              </View>
            </TouchableHighlight> 
          </View>     
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  panel: {
    flexDirection: 'column',
    alignItems:'center',
    justifyContent:'center',
    height: 170,
    width: 220,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 5
  },
  title: {
    fontSize: 17,
    paddingBottom: 2,
    fontWeight: "bold",
    marginRight:15
  },
  row: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    marginHorizontal:15
  }
});