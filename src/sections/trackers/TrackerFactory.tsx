import React from 'react';
import { Text } from 'react-native';
import { Habit } from 'habit-bets-models'; //'../../models/Habit';
import { DailyTracker } from './DailyTracker';
import { DailyHabit } from 'habit-bets-models'; //'../../models/DailyHabit';
import { PeriodicTracker } from './PeriodicTracker';
import { PeriodicHabit } from 'habit-bets-models'; //'../../models/PeriodicHabit';
import { HourlyTracker } from './HourlyTracker';
import { HourlyHabit } from 'habit-bets-models'; //'../../models/HourlyHabit';
import { OneTimeTracker } from './OneTimeTracker';
import { OneTimeHabit } from 'habit-bets-models'; //'../../models/OneTimeHabit';

type Props = {
  habit: Habit,
  showDetails: (key:string) => void,
}

export class TrackerFactory extends React.Component<Props> { 
  constructor(props: Props) {
    super(props)
  }

  render() {
    let _habit = this.props.habit;

    if (_habit instanceof DailyHabit) {
      return <DailyTracker 
        key={_habit.id}
        habit={(_habit as DailyHabit)}
        showDetails={this.props.showDetails}
      />
    }
    else if (_habit instanceof PeriodicHabit) {
      return <PeriodicTracker 
        key={_habit.id}
        habit={(_habit as PeriodicHabit)}                
        showDetails={this.props.showDetails}
      />
    }
    else if (_habit instanceof HourlyHabit) {
      return <HourlyTracker 
        key={_habit.id}
        habit={(_habit as HourlyHabit)}
        showDetails={this.props.showDetails}
      />
    }
    else if (_habit instanceof OneTimeHabit) {
      return <OneTimeTracker 
        key={_habit.id}
        habit={(_habit as OneTimeHabit)}
        showDetails={this.props.showDetails}
      />
    }
    else
      return <Text>Habit type not supported</Text>
  }
}