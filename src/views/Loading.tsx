import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export class Loading extends React.Component{
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 

  render() {
    return (
      <View>
            <View style={styles.topHeader}></View>
            <View style={styles.container}>    
                <View style={styles.row}>                  
                    <Text style={styles.heading}>Loading</Text>
                </View> 
                <View style={styles.row}>
                    <Text style={styles.circle1}></Text>
                    <Text style={styles.circle2}></Text>
                    <Text style={styles.circle3}></Text>
                </View>
            </View>
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
        height:'90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    heading:{
        fontSize:20,
        paddingBottom: 20
    },
    row:{
        flexDirection: 'row',
        //alignContent: 'flex-end'
    },
    circle1: {
        backgroundColor: '#000000',
        borderRadius: 10/2,
        paddingHorizontal: 5,
        height: 10,
        width:10,
        marginHorizontal: 8,
        marginTop:4
    },
    circle2: {
        backgroundColor: '#000000',
        borderRadius: 13/2,
        paddingHorizontal: 5,
        height: 13,
        width:13,
        marginHorizontal: 8,
        marginTop:2
    },
    circle3: {
        backgroundColor: '#000000',
        borderRadius: 16/2,
        paddingHorizontal: 5,
        height: 16,
        width:16,
        marginHorizontal: 8
    }
});