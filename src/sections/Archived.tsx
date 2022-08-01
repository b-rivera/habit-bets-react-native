import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { getArchivedHabits } from '../data/habitRepository';
import { Habit } from 'habit-bets-models'; //'../models/Habit';
import { DailyHabit } from 'habit-bets-models'; //'../models/DailyHabit';
import { OneTimeHabit } from 'habit-bets-models'; //'../models/OneTimeHabit';
import { NavigationEvents } from 'react-navigation';
import { IPeriodicHabit } from 'habit-bets-models'; //'../models/IPeriodicHabit';
import { ArchivedHabit } from './ArchivedHabit';
import { PeriodicHabit } from 'habit-bets-models'; //'../models/PeriodicHabit';
import { HourlyHabit } from 'habit-bets-models'; //'../models/HourlyHabit';

type Props = {
  navigation: any,
  refresh?: boolean
}

type State = {
  habitsLoaded: boolean,
  habitList?: Array<Habit>
}

export class Archived extends React.Component<Props, State> {  
  _unsubscribe:any;
  
  constructor(props: Props) {
    super(props)
    this.state = {
      habitsLoaded: false,
      habitList: []
    }
  }

  // static navigationOptions ={
  //   headerShown: false // Hides default Nav bar
  // };

  // Note duplication from Active
  private getItemDetails = (key:string) => {
    const habit = this.state.habitList?.filter(item => item.id === key);
    if (habit != null && habit.length > 0){
      //using any because we can't define 'navigation' here
      let detailProps: any = {
        id: habit[0].id,
        name: habit[0].name,
        type: habit[0].type,
        period: habit[0].period,
        penalty: habit[0].penalty,
      };
  
      if (habit[0] instanceof DailyHabit || habit[0] instanceof PeriodicHabit || habit[0] instanceof HourlyHabit){
        detailProps.checkins = (habit[0] as unknown as IPeriodicHabit).checkins;
      }
      
      if (habit[0] instanceof PeriodicHabit)
        detailProps.timesRequired = (habit[0] as PeriodicHabit).numRequired;
      else if (habit[0] instanceof HourlyHabit)
        detailProps.timesRequired = (habit[0] as HourlyHabit).numRequired;
      else if (habit[0] instanceof OneTimeHabit)
        detailProps.deadline = (habit[0] as OneTimeHabit).deadline;

      return detailProps;
    }
    return undefined;
  }

  showDetails = (key:string) => {
    let obj = this.getItemDetails(key);
    obj.showCopyBtn = true;
    if (obj !== undefined)
      this.props.navigation.navigate('HabitDetailsRT', obj);
  }

  async refreshList(){
    if (!this.props.refresh) return;
    //console.log("refreshList (Archived.tsx)");

    let habitlist = await getArchivedHabits();
    this.setState({
      habitList: habitlist
    })
  }

  async componentDidMount(){
    //console.log("componentDidMount (Archived.tsx)");

    let habitlist = await getArchivedHabits();
    this.setState({
      habitList: habitlist,
      habitsLoaded: true,
    })
    
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.refreshList());
  }

  async componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.habitsLoaded && <FlatList
          data={this.state.habitList}
          renderItem={({item}) => 
            <ArchivedHabit 
              key={item.id}
              id={item.id}
              title={item.name}
              showDetails={this.showDetails}
              archivedDate={item.archivedDate}
            />}
          keyExtractor={item => item.id.toString()}
        />
      } 
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    paddingTop:5,
    flex: 8,
    backgroundColor: "#E6E6E6"
  }
});