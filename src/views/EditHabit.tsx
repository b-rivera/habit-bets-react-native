import React from 'react';
import { StyleSheet,Text,View,TextInput,TouchableHighlight,Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateHabit } from '../data/habitRepository';
import NumericInput from 'react-native-numeric-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { utilities } from 'habit-bets-models';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type EditHabitParams = {
  EditHabitRT: {
    id: string;
    name: string;
    description: string;
    category: string;
    type: string;
    period: string;
    penalty: number;
    timesRequired?: number;
    deadline?: Date;
  }
}

type EditHabitState = {
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

type Props = {
  navigation: StackNavigationProp<RootStackNavigationParams, "EditHabitRT">,
  route: RouteProp<RootStackNavigationParams, "EditHabitRT">
}

export class EditHabit extends React.Component<Props, EditHabitState>{
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 

  id:string;

  constructor(props: Props) {
    super(props)
    this.id = this.props.route.params?.id || "";;
    let _timesRequired = this.props.route.params?.timesRequired || 0;
    let _deadline = this.props.route.params?.deadline;
    
    this.state = {
        name: this.props.route.params?.name,
        description: this.props.route.params?.description,
        category: this.props.route.params?.category,
        type: this.props.route.params?.type,
        period: this.props.route.params?.period,
        penalty: this.props.route.params?.penalty,
        timesRequired: _timesRequired,
        deadline: _deadline,
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

  cancelEdit = () => {
    this.props.navigation.navigate('HomeRT', {refresh:false});
  }

  submitEdit = () => {
    let habit: any = {};
    habit.name = this.state.name;
    habit.description = this.state.description;
    habit.category = this.state.category;
    habit.type = this.state.type;
    habit.period = this.state.period;
    habit.penalty = this.state.penalty;
    if (this.state.timesRequired)
      habit.numRequired = this.state.timesRequired;
    if (this.state.deadline)
      habit.deadline = this.state.deadline;

    updateHabit(this.id, habit);
    this.props.navigation.navigate('HomeRT', {refresh:true});
  }  

  componentDidMount(){
    console.log("EditHabit: Component did mount");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Habit:</Text>
        <View style={styles.row}>
            <TextInput
            style={styles.inputs}
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
                    onValueChange={(itemValue) => this.setState({period: itemValue})}
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
            <View style={{flex:1, justifyContent:'center', marginLeft:15}}> 
              <NumericInput 
                initValue={this.state.timesRequired}
                value={this.state.timesRequired} 
                onChange={value => this.setState({timesRequired: value})} 
                // onLimitReached={(isMax,msg) => console.log(isMax,msg)}
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
            <View style={{flex:1, justifyContent:'center', marginLeft:15}}> 
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
          <View style={{flex:1, justifyContent:'center', marginLeft:15}}> 
            <NumericInput 
              initValue={this.state.penalty} 
              value={this.state.penalty} 
              onChange={value => this.setState({penalty: value})} 
              // onLimitReached={(isMax,msg) => console.log(isMax,msg)}
              minValue={0}
              valueType='real'
              rounded />
          </View>
        </View>
          
        <View style={styles.buttonBar}>  
          <TouchableHighlight onPress={this.cancelEdit} underlayColor='#31e981'>
            <Text style = {styles.buttons}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.submitEdit} underlayColor='#31e981'>
            <Text style = {styles.buttons}>Update</Text>
          </TouchableHighlight>
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
  buttonBar:{
    paddingTop: 30,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading:{
    fontSize:18,
    paddingBottom: 10
  },
  row:{    
    flexDirection: 'row',
    paddingVertical: 7,
    width: '85%'
  },
  rowlabel:{    
    fontSize:16,
    textAlign: "right",
  },
  rowinput:{     
    fontSize:16,   
    marginLeft: 15,
    backgroundColor: '#FFFFFF'
  },
  inputs:{
    flex:1,
    fontSize:16,  
    paddingVertical: 7,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF'
  },
  buttons:{
    marginHorizontal: 20,
    fontSize:16
  }
});