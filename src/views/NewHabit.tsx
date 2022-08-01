import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addHabit } from '../data/habitRepository';
import NumericInput from 'react-native-numeric-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { utilities } from 'habit-bets-models'; 
import { HabitFactory } from 'habit-bets-models';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type NewHabitParams = {
  NewHabitRT : {}
}

type NewHabitProps = {
  navigation: StackNavigationProp<RootStackNavigationParams, "NewHabitRT">,
  route: RouteProp<RootStackNavigationParams, "NewHabitRT">
}
  
type NewHabitState = {
  name: string,
  description: string,
  category: string,
  type: string,
  period: string,
  penalty: number,
  timesRequired?: number,
  deadline?: Date,
  showDeadline: boolean
}


export class NewHabit extends React.Component<NewHabitProps, NewHabitState>{
  static navigationOptions ={
  headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: NewHabitProps) {
    super(props)
    this.state = {
        name: '',
        description: '',
        category: '',
        type: 'daily',
        period: '',
        penalty: 0,
        timesRequired: 0,
        showDeadline: false
    }
  }

  onDeadlineChange = (event:any, selectedDate?:Date) => {
    const currentDate = selectedDate || this.state.deadline;
    this.setState({
      deadline: currentDate,
      showDeadline: Platform.OS === 'ios'      
    })
  };

  cancelSubmit = () => {
    this.props.navigation.navigate('HomeRT', {});
  }

  submitHabit = () => {
    let today = new Date();

    let habitFactory = new HabitFactory();
    let habit = habitFactory.createHabit({
      'id': -1,
      'name': this.state.name,
      'description': this.state.description,
      'category': this.state.category,
      'dateCreated': today,
      'type': this.state.type,
      'period': this.state.period,
      'status': "active",
      'penalty': this.state.penalty,
      'checkins': {},
      'numRequired': this.state.timesRequired,
      'deadline': this.state.deadline || today,
      'completed': false
    });

    addHabit(habit);
    this.props.navigation.navigate('HomeRT', {refresh:true});
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add a New Habit:</Text>
          <View style={styles.row}>
              <TextInput
              style={styles.inputs}
              placeholder="Title"
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name}
              />
          </View>
          <View style={styles.row}>
              <TextInput
              style={styles.inputs}
              placeholder="Description"
              multiline={true}
              numberOfLines={2}
              onChangeText={(text) => this.setState({description: text})}
              value={this.state.description}
              />
          </View>
          <View style={styles.row}>
              <TextInput
              style={styles.inputs}
              placeholder="Category/Area"
              onChangeText={(text) => this.setState({category: text})}
              value={this.state.category}
              />
          </View>
          <View style={styles.row}>            
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>Type:</Text>
              </View>
              <View style={{flex:1, justifyContent:'center'}}> 
                  <Picker
                      style={styles.rowinput}
                      onValueChange={(itemValue) => this.setState({type: itemValue})}
                      selectedValue={this.state.type}>
                      <Picker.Item label="Daily" value="daily" />
                      <Picker.Item label="Periodic" value="periodic" />
                      <Picker.Item label="Hourly" value="hourly" />
                      <Picker.Item label="One Time" value="oneTime" />
                  </Picker>
              </View>
          </View>

          { this.state.type !== 'oneTime' && this.state.type !== 'daily' && (
            <View style={styles.row}>  
                <View style={{justifyContent:'center'}}> 
                    <Text style={styles.rowlabel}>Period:</Text>
                </View>
                <View style={{flex:1, justifyContent:'center'}}> 
                    <Picker
                      style={styles.rowinput}
                      onValueChange={(value, index) => this.setState({period: value})}
                      selectedValue={this.state.period}>
                        <Picker.Item label="Week" value="week" />
                        <Picker.Item label="Month" value="month" />
                    </Picker>
                </View>
            </View>
          )}

          { this.state.type !== 'daily' && this.state.type !== 'oneTime' && (
            <View style={styles.row}>  
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>
                      {this.state.type === 'hourly' ? "hours" : "times"} / {this.state.period || "week"}:
                  </Text>
              </View>
              <View style={{flex:1, justifyContent:'center', paddingLeft:10}}> 
                <NumericInput 
                  initValue={this.state.timesRequired} 
                  value={this.state.timesRequired} 
                  onChange={value => this.setState({timesRequired: value})} 
                  onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                  minValue={0}
                  valueType='integer'
                  rounded />
              </View>
            </View>
          )}

          { this.state.type === 'oneTime' && (
            <View style={styles.row}>  
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>Deadline:</Text>
              </View>
              <View style={{flex:1, justifyContent:'center', paddingLeft:5}}> 
                <TouchableHighlight style={styles.rowinput} underlayColor='#31e981'
                  onPress={() => this.setState({showDeadline: true})}>
                  <Text >{utilities.getDateString(this.state.deadline) || 'Select deadline'}</Text>
                </TouchableHighlight>
                { this.state.showDeadline && (<DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.deadline || new Date()}
                  mode='date'
                  display="default"
                  onChange={this.onDeadlineChange}
                />)}
              </View>
            </View>
          )}

          <View style={styles.row}>  
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowlabel}>Penalty ($):</Text>
            </View>
            <View style={{flex:1, justifyContent:'center', marginLeft:10}}> 
              <NumericInput 
                initValue={this.state.penalty} 
                value={this.state.penalty} 
                onChange={value => this.setState({penalty: value})} 
                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                minValue={0}
                valueType='real'
                rounded />
            </View>
          </View>
          <View style={styles.buttonBar}>  
            <TouchableHighlight onPress={this.cancelSubmit} underlayColor='#31e981'>
              <Text style = {styles.buttons}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.submitHabit} underlayColor='#31e981'>
              <Text style = {styles.buttons}>Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{      
    flex:1,
    alignItems: 'center',
    paddingTop: '10%',
    backgroundColor: '#EAEAEA'
  },
  row:{    
    flexDirection: 'row',
    paddingVertical: 7,
    width: '85%'
  },
  rowinput:{        
    marginLeft: 10,
    backgroundColor: '#FFFFFF'
  },
  rowlabel:{    
    fontSize:16,
    textAlign: "right"
  },
  heading:{
    fontSize:18,
    paddingBottom: 10
  },
  inputs:{
    flex:1,
    fontSize:16,   
    paddingVertical: 7,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF'
  },
  buttonBar:{
    marginTop: 30,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons:{
    marginHorizontal: 20,
    fontSize:16
  }
});