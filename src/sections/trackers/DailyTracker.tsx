import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarCheck, faCalendar, faCalendarTimes } from '@fortawesome/free-regular-svg-icons';
import { clearDayCheckin, addDayCheckin, skipDay } from '../../data/habitRepository';
import { DailyHabit } from 'habit-bets-models'; //'../../models/DailyHabit';

type Props = {
  key: string,
  habit: DailyHabit,
  showDetails: (key:string) => void,
}
type State = {  
  numCompleted: number,
  //completed: boolean,
  state: number, //-1,0,1
  penaltyThisPeriod: number
}

export class DailyTracker extends React.Component<Props, State> {
  id: string;
  title: string;
  penalty: number;
  numRequired = 7;

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)

    // Set readonly props
    this.id = this.props.habit.id;
    this.title = this.props.habit.name;
    this.penalty = this.props.habit.penalty;
    
    let _numCompleted = this.props.habit.getCheckinTotalForPeriod();
    
    this.state = {
      numCompleted: _numCompleted,
      state: this.props.habit.getTodaysCheckinValue(),// > 0,
      penaltyThisPeriod: (this.numRequired - _numCompleted) * this.penalty
    }
  }

  toggleCheckin=()=>{
    // PREVIOUSLY CHECKED
    if (this.state.state == 1){ 
      let newCount = this.state.numCompleted - 1;
      this.setState({
        numCompleted: newCount,
        state: 0,
        penaltyThisPeriod: (this.numRequired - newCount) * this.penalty
      })
      clearDayCheckin(this.id, new Date());
    } 
    // PREVIOUSLY UNCHECKED or SKIPPED
    else if (this.state.state <= 0) {  
      let newCount = this.state.numCompleted + 1;
      this.setState({
        numCompleted: newCount,
        state: 1,
        penaltyThisPeriod: (this.numRequired - newCount) * this.penalty
      })
      addDayCheckin(this.id, new Date());
    }
  }

  toggleSkip=()=>{
    // IF PREVIOUSLY SKIPPED
    if (this.state.state == -1){ 
      this.setState({
        state: 0
      })
      clearDayCheckin(this.id, new Date());
    }
    // IF PREVIOUSLY UNCHECKED
    else if (this.state.state == 0){ 
      this.setState({
        state: -1
      })
      skipDay(this.id, new Date());
    }
    // IF PREVIOUSLY CHECKED
    else if (this.state.state == 1){
      let newCount = this.state.numCompleted - 1;
      this.setState({
        numCompleted: newCount,
        state: -1,
        penaltyThisPeriod: (this.numRequired - newCount) * this.penalty
      })
      skipDay(this.id, new Date());
    }
  }
  
  render() {    
    let completed = this.state.numCompleted >= 7;
    return (
      <View style={[styles.container, (completed ? styles.completed : styles.open)]}>
        <View style={styles.infoPanel}>
          <TouchableHighlight onPress={() => this.props.showDetails(this.id)}>
            <Text style={styles.title}>{this.title}</Text>
          </TouchableHighlight>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.subTitle}>
              {this.state.numCompleted}/7 this week
            </Text>
            { this.state.penaltyThisPeriod > 0 &&
              <Text style={styles.circle}>${this.state.penaltyThisPeriod}</Text>
            }
          </View>
        </View>
        <View style={styles.buttonPanel}>    
          <View style={{alignItems: 'center', justifyContent: 'center'}}>      
            <TouchableHighlight onPress={this.toggleCheckin} onLongPress={this.toggleSkip}>
              <View>
                {this.state.state == 1 && (
                  <FontAwesomeIcon size={35} icon={faCalendarCheck}/>
                )}
                {this.state.state == 0 && (
                  <FontAwesomeIcon size={35} icon={faCalendar}/>
                )}
                {this.state.state == -1 && (
                  <FontAwesomeIcon size={35} icon={faCalendarTimes}/>
                )}
              </View>
            </TouchableHighlight>
            {this.state.state == 1 && (<Text>Done</Text>)}
            {this.state.state == -1 && (<Text>Skipped</Text>)}
          </View>
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
  },
  completed: {
    backgroundColor: '#85FF85'
  },
  open: {
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom:3
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    backgroundColor: '#FF8080',
    borderRadius: 23/2,
    paddingHorizontal: 5,
    height: 23,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  button: {
    marginHorizontal: 8,
    height: 38,
    width: 38,
  },
  skippedCircle: {
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
    marginHorizontal: 8,
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedCircle: {
    backgroundColor: '#35FC35',
    borderRadius: 4,
    marginHorizontal: 8,
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center'
  }
});