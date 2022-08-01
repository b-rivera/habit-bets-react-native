import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { User } from 'habit-bets-models';
import { getFriendsForCurrentUser } from '../data/userRepository';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type FriendsParams = {
  FriendsRT : {
    refresh?:boolean;
  }
}

type FriendsProps = {
  navigation: StackNavigationProp<RootStackNavigationParams, "FriendsRT">,
  route: RouteProp<RootStackNavigationParams, "FriendsRT">
}

type State = {
  friendsLoaded: boolean,
  friendList?: Array<User>
}

export class Friends extends React.Component<FriendsProps, State>{
  _unsubscribe:any;

  constructor(props: FriendsProps) {
    super(props)
    this.state = {
      friendsLoaded: false,
      friendList: []
    }
  }

  async refreshList(){
    if (!this.props.route.params?.refresh) return;

    //console.log("Friends.refreshList()");
    
    try {
      let friends = await getFriendsForCurrentUser();      
      //console.log("Friends: " + friends);
      this.setState({
        friendList: friends,
      })
    }
    catch(err:any){
      console.log("getFriendsForCurrentUser error: " + err.message)
    }
  }

  async componentDidMount(){
    //console.log("Friends.componentDidMount()");
    try {
      let friends = await getFriendsForCurrentUser();      
      //console.log("Friends: " + friends);
      this.setState({
        friendList: friends,
        friendsLoaded: true,
      })
    }
    catch(err:any){
      console.log("getFriendsForCurrentUser error: " + err.message)
    }
    
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.refreshList());
  }

  async componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.friendsLoaded && <FlatList
            data={this.state.friendList}
            renderItem={({item}) => 
              <Text>{item.fullName}</Text> 
            }
            keyExtractor={item => item.uid.toString()}
          />
        } 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topHeader:{
    height: 23,
    backgroundColor: '#D8D8D8',
  },
  container:{
    flex:1,
    alignItems: 'center'
  },
  navItemStyle: {
    padding: 10
  },
  navSectionStyle: {
    //backgroundColor: 'lightgrey'
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'lightgrey'
  },
  heading:{
    fontSize:16,
    paddingBottom: 10
  },
  logo: {
    //flex: 1,
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 20
  },
  labels:{
    fontSize:16,
    alignSelf: "center",
    marginVertical: 10
  },
  submitButton:{
    backgroundColor: '#788eec',
    width: '60%',
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  }
});