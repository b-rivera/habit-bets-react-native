import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { updateHabit } from '../../data/habitRepository';
import { utilities } from 'habit-bets-models'; //getDateString } from '../../utilities/dateParsing-OUT';
import { OneTimeHabit } from 'habit-bets-models'; //'../../models/OneTimeHabit';

type Props = {
  key: string,
  habit: OneTimeHabit
  showDetails: (key:string) => void,
}
type State = {  
  completed: boolean
}

export class OneTimeTracker extends React.Component<Props, State> {
  id: string;
  title: string;
  deadline: Date;
  penalty: number;
  isDueThisWeek: boolean;

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)

    // Save readonly props
    this.id = this.props.habit.id;
    this.title = this.props.habit.name;
    this.deadline = this.props.habit.deadline;
    this.penalty = this.props.habit.penalty; 
    this.isDueThisWeek = this.props.habit.isDueThisWeek();

    this.state = {
      completed: this.props.habit.completed
    }
  }

  toggleCheckin=()=>{
    if (this.state.completed){
      this.setState({
        completed: false
      })
      // could potentially do the updating when unfocusing, take just final val
      updateHabit(this.id, {completed: false});
    } 
    else {
      this.setState({
        completed: true
      })
      // could potentially do the updating when unfocusing, take just final val
      updateHabit(this.id, {completed: true});
    }
  }
  
  render() {
    let showPenalty = this.isDueThisWeek && !this.state.completed;
    return (
      <View style={styles.container}>
        <View style={styles.infoPanel}>          
          <TouchableHighlight onPress={() => this.props.showDetails(this.id)}>
            <Text style={styles.title}>{this.title}</Text>
          </TouchableHighlight>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.subTitle}>
              Due: {utilities.getDateString(this.deadline)}
            </Text>
            { showPenalty &&
              <Text style={styles.circle}>${this.penalty}</Text>
            }
          </View>
        </View>
        <View style={styles.buttonPanel}>          
          {!this.state.completed && (
            <TouchableHighlight onPress={this.toggleCheckin}>
              <View>
                <FontAwesomeIcon size={35} icon={faSquare}/>
              </View>
            </TouchableHighlight>
          )}
          {this.state.completed && (
            <TouchableHighlight style={styles.completed} onPress={this.toggleCheckin}>
              <View>
                <FontAwesomeIcon size={35} icon={faCheckSquare}/>
              </View>
            </TouchableHighlight>
          )}          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:6,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 17,
    fontWeight: "bold"
  },
  subTitle: {
    fontSize: 16,
    paddingLeft: 2,
    marginRight: 10
  },
  infoPanel: {
    flex:4
  },
  buttonPanel: {
    flex:2,
    alignItems: 'center',
    justifyContent: 'center'
  },  
  completed: {
    backgroundColor: '#85FF85'
  },
  open: {
    backgroundColor: '#FFFFFF'
  },
  circle: {
    backgroundColor: '#FF8080',
    borderRadius: 23/2,
    paddingHorizontal: 5,
    height: 23,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});