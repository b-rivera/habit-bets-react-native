import React from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import { getHabits } from '../data/habitRepository';
import { Habit } from 'habit-bets-models'; //'../models/Habit';
import { DailyHabit } from 'habit-bets-models'; //'../models/DailyHabit';
import { PeriodicHabit } from 'habit-bets-models'; //'../models/PeriodicHabit';
import { HourlyHabit } from 'habit-bets-models'; //'../models/HourlyHabit';
import { OneTimeHabit } from 'habit-bets-models'; //'../models/OneTimeHabit';
import { IPeriodicHabit } from 'habit-bets-models'; //'../models/IPeriodicHabit';
import { TrackerFactory } from './trackers/TrackerFactory';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSadTear } from '@fortawesome/free-regular-svg-icons';

type ActiveProps = {
  navigation: any,
  refresh?: boolean
}

type ActiveState = {
  habitsLoaded: boolean,
  habitList?: Array<Habit>
  habitGroupList?: Array<HabitGroup>
}

type HabitGroup = {
  title: string;
  data: Array<Habit>
}

export class Active extends React.Component<ActiveProps, ActiveState> {  
  _unsubscribe:any;
  
  constructor(props: ActiveProps) {
    super(props)
    this.state = {
      habitsLoaded: false,
      habitList: []
    }
  }

  // static navigationOptions ={
  //   headerShown: false // Hides default Nav bar
  // };

  private getItemDetails = (key:string) => {
    const habit = this.state.habitList?.filter(item => item.id === key);
    if (habit != null && habit.length > 0){
      //using any because we can't define 'navigation' here
      let detailProps: any = {
        //key: habit[0].id,
        id: habit[0].id,
        name: habit[0].name,
        description: habit[0].description,
        category: habit[0].category,
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
    obj.showEdit = this.showEdit;
    obj.showArchiveBtn = true;
    obj.showEditBtn = true;
    if (obj !== undefined)
      this.props.navigation.navigate('HabitDetailsRT', obj);
  }

  showEdit = (key:string) => {
    let obj = this.getItemDetails(key);
    if (obj !== undefined)
      this.props.navigation.navigate('EditHabitRT', obj);
  }
  
  groupHabits(habitlist:Array<Habit>):Array<HabitGroup>{
      let groupedHabits:Array<HabitGroup> = []; // [{title:category, data:[Habit,...]},...]
      let categories:{[key:string]: number} = {}; //[category] : index
      let catCount = 0;
      habitlist.forEach((item:Habit) => {
          if (!categories.hasOwnProperty(item.category)){
              categories[item.category] = catCount;
              groupedHabits.push({title: item.category, data:[item]});
              catCount++;
          } else {
              groupedHabits[categories[item.category]].data.push(item);
          }
      });

      return groupedHabits;
  }

  async refreshList(){
    if (!this.props.refresh) return;
    //console.log("refreshList (Active.tsx)");

    // Clear the object, otherwise no changes happen
    this.setState({
      habitList: [],
      habitGroupList:[]
    });

    let _habitlist = await getHabits();

    this.setState({
      habitList: _habitlist,
      habitGroupList: this.groupHabits(_habitlist)
    });
  }

  async componentDidMount(){    
    let _habitlist = await getHabits();

    this.setState({
      habitList: _habitlist,
      habitGroupList: this.groupHabits(_habitlist),
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
        { !!this.state.habitsLoaded && <>
          {(!!this.state.habitList && this.state.habitList.length > 0) ? 
            <SectionList
              sections={this.state.habitGroupList || []}          
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return <TrackerFactory 
                  key={item.id}
                  habit={(item as DailyHabit)}
                  showDetails={this.showDetails}
                />
              }}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{"- - - - - - - - - - - -"}</Text>
                  <Text style={styles.sectionTitle}>{title || "General"}</Text>  
                  <Text style={styles.sectionTitle}>{"- - - - - - - - - - - -"}</Text>
                </View>
              )}
          /> : 
          <Text style={styles.bodyText}>
            No habits yet <FontAwesomeIcon size={15} icon={faSadTear}/>
          </Text>
        }
        </>
      } 
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    paddingTop:5,
    flex: 8,
    backgroundColor: '#353535'
  },
  sectionHeader:{
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row",
    marginVertical:2
  },
  sectionTitle: {
    marginHorizontal: 20,
    color: '#fff'
  },
  bodyText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical:10,
    color: '#fff'
  }
});