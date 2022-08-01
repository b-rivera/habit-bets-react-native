import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Archived } from '../sections/Archived';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type ArchiveParams = {
  ArchiveRT : {
    refresh?:boolean;
    user?:any; //User
  }
}

type ArchiveProps = {
  navigation: StackNavigationProp<RootStackNavigationParams, "ArchiveRT">,
  route: RouteProp<RootStackNavigationParams, "ArchiveRT">
}

type ArchiveState = {
  user?:any
}

export class ArchiveView extends React.Component<ArchiveProps, ArchiveState> {  
  constructor(props: ArchiveProps) {
    super(props)
    
    this.state = {
      user: this.props.route.params?.user
    };
  }

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  };

  render() {
    let doRefresh = this.props.route.params?.refresh || false;
    return (
      <View style={styles.container}>
        <Archived navigation={this.props.navigation} refresh={doRefresh}/>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 4
  }
});