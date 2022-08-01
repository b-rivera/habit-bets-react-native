// React Navigation Drawer with Sectioned Menu Options & Footer
// https://aboutreact.com/navigation-drawer-sidebar-menu-with-sectioned-menu-options-footer/

import React from 'react';
import {SafeAreaView, View, StyleSheet, Text} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

type Props = {
  state: any,
  navigation: any,
  descriptors: any
}

type State = {
  routes: any,
  index: number,
}

export class SideBar extends React.Component<Props, State> {
  lastGroupName:string;
  newGroup:boolean;

  constructor(props: Props) {
    super(props)
    this.state = {
      routes: props.state.routes || [],
      index: props.state.index || 0,
    }

    this.lastGroupName = '';
    this.newGroup = true;
  }

  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  };

  render () {
    return (
    <SafeAreaView style={{flex: 1}}>
      <DrawerContentScrollView {...this.props}>
        {this.state.routes.map((route:any) => {
          const {
            drawerLabel,
            activeTintColor,
            groupName
          } = this.props.descriptors[route.key].options;

          if (this.lastGroupName !== groupName) {
            this.newGroup = true;
            this.lastGroupName = groupName;
          } 
          else this.newGroup = false;

          return (
            <>
              {this.newGroup ? (
                <View style={styles.sectionContainer}>
                  <Text key={groupName} style={{marginLeft: 16}}>
                    {groupName}
                  </Text>
                  <View style={styles.sectionLine} />
                </View>
              ) : null}
              <DrawerItem
                key={route.key}
                label={
                  ({color}) =>
                    <Text style={{color}}>
                      {drawerLabel}
                    </Text>
                }
                focused={
                  this.state.routes.findIndex(
                    (e:any) => e.name === route.name
                  ) === this.state.index
                }
                activeTintColor={activeTintColor}
                onPress={() => this.props.navigation.navigate(route.name)}
              />
            </>
          );
        })}
      </DrawerContentScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
      </Text>
    </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionLine: {
    backgroundColor: 'gray',
    flex: 1,
    height: 1,
    marginLeft: 10,
    marginRight: 20,
  },
});