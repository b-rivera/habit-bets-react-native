import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { utilities } from 'habit-bets-models'; //getDateString } from '../utilities/dateParsing-OUT';

type Props = {
  key: string,
  id: string,
  title: string,  
  showDetails: (key:string) => void,
  archivedDate?: Date
}

export class ArchivedHabit extends React.Component<Props> {
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 
  
  constructor(props: Props) {
    super(props)
  }
    
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.infoPanel}>
          <TouchableHighlight onPress={() => this.props.showDetails(this.props.id)}>
            <Text style={styles.title}>{this.props.title}</Text>
          </TouchableHighlight>
          <Text style={styles.subTitle}>
            Archived on {utilities.getDateString(this.props.archivedDate) || ""}
          </Text>
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
    paddingVertical: 5,
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
    marginTop: 2
  },
  infoPanel: {
    flex:4
  }
});