import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
//import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
//import { faPlusSquare, faMinusSquare, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { addHourlyCheckin, addDayCheckin } from '../../data/habitRepository';
import NumericInput from 'react-native-numeric-input';
import { HourlyHabit } from 'habit-bets-models'; //'../../models/HourlyHabit';

type Props = {
  key: string,
  habit: HourlyHabit,
  showDetails: (key:string) => void
}

type State = {  
  numCompleted: number,
  hoursToday: number,
  penaltyThisPeriod: number
}

export class HourlyTracker extends React.Component<Props, State> {
  id: string;
  title: string;
  numRequired: number;
  period: string;
  penalty: number;
  startingNumCompleted: number;
  startingTodaysCheckinValue: number;

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)

    // Set readonly props
    this.id = this.props.habit.id;
    this.title = this.props.habit.name;
    this.startingNumCompleted = this.props.habit.getCheckinTotalForPeriod();
    this.startingTodaysCheckinValue = this.props.habit.getTodaysCheckinValue();
    this.numRequired = this.props.habit.numRequired;
    this.period = this.props.habit.period;
    this.penalty = this.props.habit.penalty;

    this.state = {
      numCompleted: this.startingNumCompleted,
      hoursToday: this.startingTodaysCheckinValue,
      penaltyThisPeriod: (this.numRequired - this.startingNumCompleted) * this.penalty
    }
  }

  updateHours = (latestHours:number) => {
    if (latestHours < 0) return;

    let adjustedCompleted = this.startingNumCompleted - this.startingTodaysCheckinValue + latestHours;
    // for numCompleted, it comes in as a prop including today's value. We need to
    // discount that so we can decrement value when needed.
    this.setState({
      numCompleted: adjustedCompleted,
      hoursToday: latestHours,
      penaltyThisPeriod: (this.numRequired - adjustedCompleted) * this.penalty
    })
    // could potentially do the updating when unfocusing, take just final val
    addHourlyCheckin(this.id, new Date(), latestHours);
  }

  render() {
    let completed = this.state.numCompleted >= this.numRequired;
    return (
      <View style={[styles.container, (completed ? styles.completed : styles.open)]}>
        <View style={styles.infoPanel}>          
          <TouchableHighlight onPress={() => this.props.showDetails(this.id)}>
            <Text style={styles.title}>{this.title}</Text>
          </TouchableHighlight>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.subTitle}>
              {this.state.numCompleted}/{this.numRequired} hours this {this.period}
            </Text>
            { this.state.penaltyThisPeriod > 0 &&
              <Text style={styles.circle}>${this.state.penaltyThisPeriod}</Text>
            }
          </View>
        </View>
        <View style={styles.buttonPanel}> 
          <NumericInput 
            initValue={this.state.hoursToday} 
            value={this.state.hoursToday} 
            onChange={value => this.updateHours(value)} 
            // onLimitReached={(isMax,msg) => console.log(isMax,msg)}
            minValue={0}
            valueType='integer'
            totalWidth={100}
            totalHeight={40}
            rounded />
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
    fontWeight: "bold",
    marginBottom: 3
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
  button: {
    padding: 3
  },  
  circle: {
    backgroundColor: '#FF8080',
    borderRadius: 23/2,
    paddingHorizontal: 5,
    height: 23,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  completed: {
    backgroundColor: '#85FF85'
  },
  open: {
    backgroundColor: '#FFFFFF'
  },
});