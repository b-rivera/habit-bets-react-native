import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

 
type Props = {
  navigate: any,
  checkinStatus: number,
  onCancel: () => void,
  onSave: (checkin:number) => void
}

type State = {  
  //checkinStatus: boolean,
  isChecked: boolean,
  isSkipped: boolean
}

export class CheckinModal extends React.Component<Props, State> {
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)
    this.state = {
      //checkinStatus: props.checkinStatus,
      isChecked: props.checkinStatus > 0,
      isSkipped: props.checkinStatus < 0
    }
  }

  cancelModal = () => {
    this.props.onCancel();
  }

  callOnSave=()=>{
    let newValue = 0;
    if (this.state.isChecked) newValue = 1;
    if (this.state.isSkipped) newValue = -1;

    this.props.onSave(newValue);
    //this.props.onSave(this.state.checkinStatus);
  }

  toggleChecked = (value:boolean) => {    
    this.setState({
      //checkinStatus: value
      isChecked: value,
      isSkipped: (value) ? false : this.state.isSkipped
    })
  }

  toggleSkipped = (value:boolean) => {
    this.setState({
      //checkinStatus: value
      isSkipped: value,
      isChecked: (value) ? false : this.state.isChecked
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.panel}>
          <View style={styles.row}>
            <Text style={styles.title}>Completed?</Text>
            <Switch
              style={{ marginLeft: 15, transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
              onValueChange = {this.toggleChecked}
              value = {this.state.isChecked}/>
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
    height: 140,
    width: 220,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    padding: 5
  },
  title: {
    fontSize: 17,
    paddingBottom: 2,
    fontWeight: "bold"
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