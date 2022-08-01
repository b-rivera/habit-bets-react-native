import React from 'react';
import { StyleSheet,Text,View,TouchableHighlight,Alert,Dimensions,Modal } from 'react-native';
import { utilities } from 'habit-bets-models'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faFileArchive, faCopy, faEdit, faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { Calendar } from 'react-native-calendars';
import { Checkins } from 'habit-bets-models';
import { CheckinModal } from '../sections/CheckinModal';
import { HourlyModal } from '../sections/HourlyModal';
import { clearDayCheckin, addDayCheckin, addHourlyCheckin, removeHabit, 
  archiveActiveHabit, copyArchivedHabit, skipDay } from '../data/habitRepository';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigationParams } from '../types/RootStackNavigationParams';

export type HabitDetailsParams = {
  HabitDetailsRT: {
    id: string;
    name: string;
    description: string;
    category: string;
    type: string;
    period: string;
    penalty: number;
    checkins?:Checkins;
    showEdit: (key:string) => void;
    timesRequired?: number;
    deadline?: Date;
    showArchiveBtn?: boolean;
    showEditBtn?: boolean;
    showCopyBtn?: boolean;
  }
}

type Props = {
  navigation: StackNavigationProp<RootStackNavigationParams, "HabitDetailsRT">,
  route: RouteProp<RootStackNavigationParams, "HabitDetailsRT">
}

type State = {  
  isModalVisible: boolean,
  checkins:Checkins,
  markedDates: any,
  selectedDate?: Date,
  selectedCheckinValue: number,
  //selectedCheckinHours: number,
  changesMade:boolean
}

export class HabitDetails extends React.Component<Props, State>{
  static navigationOptions ={
    headerShown: false // Hides default Nav bar
  }; 

  id:string;

  constructor(props: Props) {
    super(props)

    this.id = this.props.route.params?.id || "";
    let _checkins = this.props.route.params?.checkins;
    
    this.state = {
      checkins: _checkins ? _checkins : {},
      markedDates: this.getTransformedCheckins(_checkins || {}),
      isModalVisible: false,
      selectedDate: undefined,
      selectedCheckinValue: 0,
      changesMade: false
    }
  }

  getHeaderButtons(){
    let showEdit = this.props.route.params?.showEdit;
    let showArchiveBtn = this.props.route.params?.showArchiveBtn || false;
    let showEditBtn = this.props.route.params?.showEditBtn || false;
    let showCopyBtn = this.props.route.params?.showCopyBtn || false;

    return (
      <View style={styles.headBarStyle}> 
        <TouchableHighlight onPress={this.confirmDelete} underlayColor='#31e981'>
          <View style={styles.buttons}>
            <FontAwesomeIcon size={30} icon={faTrashAlt} style={styles.headerIconStyle}/>
          </View>
        </TouchableHighlight> 
        { showArchiveBtn &&
          <TouchableHighlight onPress={this.confirmArchive} underlayColor='#31e981'>
            <View style={styles.buttons}>
              <FontAwesomeIcon size={30} icon={faFileArchive} style={styles.headerIconStyle}/>
            </View>
          </TouchableHighlight>
        }        
        { showEditBtn &&
          <TouchableHighlight onPress={() => showEdit(this.id)} underlayColor='#31e981'>
            <View style={styles.buttons}>
              <FontAwesomeIcon size={30} icon={faEdit} style={styles.headerIconStyle}/>
            </View>
          </TouchableHighlight>
        }
        { showCopyBtn &&
          <TouchableHighlight onPress={this.confirmCopy} underlayColor='#31e981'>
            <View style={styles.buttons}>
              <FontAwesomeIcon size={30} icon={faCopy} style={styles.headerIconStyle}/>
            </View>
          </TouchableHighlight>
        }
      </View>
    )
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight onPress={this.cancelRegister} underlayColor='#31e981'>
          <View style={styles.buttons}>
            <FontAwesomeIcon size={30} icon={faArrowAltCircleLeft} style={styles.headerIconStyle}/>
          </View>
        </TouchableHighlight>
      ),
      headerRight: () => this.getHeaderButtons()
    });
  }

  cancelRegister = () => {
    this.props.navigation.navigate('HomeRT', {refresh:this.state.changesMade});
  }

  executeDelete = () => {    
    //console.log("deleting id: " + this.id);
    if (this.id){
      // Run delete operation
      removeHabit(this.id);
      this.props.navigation.navigate('HomeRT', {refresh:true});
    }
  }

  confirmDelete = () => {
    let title = "Delete habit?";
    let message = "Are you sure you want to remove '" 
      + (this.props.route.params?.name || "") + "' from your habits?"
    Alert.alert(title, message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Delete", 
          onPress: this.executeDelete 
        }
      ],
      { cancelable: false }
    );
  }

  executeArchive = () => {    
    //console.log("archiving id: " + this.id);
    if (this.id){
      // Run delete operation
      archiveActiveHabit(this.id);
      this.props.navigation.navigate('HomeRT', {refresh:true});
    }
  }

  confirmArchive = () => {
    let title = "Archive habit?";
    let message = "Are you sure you want to archive '" 
      + (this.props.route.params?.name || "") + "' from your habits?"
    Alert.alert(title, message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Archive", 
          onPress: this.executeArchive 
        }
      ],
      { cancelable: false }
    );
  }

  executeCopy = () => {    
    //("creating copy of id: " + this.id);
    if (this.id){
      // Run delete operation
      copyArchivedHabit(this.id);
      this.props.navigation.navigate('HomeRT', {refresh:true});
    }
  }

  confirmCopy = () => {
    let title = "Create a copy?";
    let message = "Are you sure you want to create a copy of '" 
      + (this.props.route.params?.name || "") + "'?"
    Alert.alert(title, message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Copy", 
          onPress: this.executeCopy
        }
      ],
      { cancelable: false }
    );
  }

  getSelectedDateObject(value:number):object{
    return {
      selected: true,
      selectedColor: (value > 0) ? '#2EB82E' : '#999999'
    };
  }

  getTransformedCheckins = (checkins:Checkins) => {
    //let checkins = this.props.navigation.getParam('checkins') ? this.props.navigation.getParam('checkins') : undefined;
    if (checkins === undefined) return undefined;

    const calCheckins:{[key: string]:object} = {};
    for (let key in checkins){
      if (checkins.hasOwnProperty(key)){
        calCheckins[key] = this.getSelectedDateObject(checkins[key])
      }
    }

    return calCheckins;
  }

  onDayPress = (day:any) => {
    let dateKey = day.dateString;
    let date = new Date(day.year, day.month-1, day.day);
    //console.log("Pressed: " + dateKey + " (" + date + ")");
    if (this.state.checkins){
      if (this.state.checkins.hasOwnProperty(dateKey)){
        this.setState({
          selectedCheckinValue: this.state.checkins[dateKey],
          isModalVisible: true,
          selectedDate: date
        });
      }
      else {
        this.setState({
          selectedCheckinValue: 0,
          //selectedCheckinStatus: false,
          //selectedCheckinHours: 0,
          isModalVisible: true,
          selectedDate: date
        });
      }
    }
  }

  onCancel=()=>{
    this.setState({
      isModalVisible: false
    });
  }

  clearModal=()=>{    
    this.setState({
      //selectedCheckinStatus: false,
      //selectedCheckinHours: 0,
      selectedCheckinValue: 0,
      isModalVisible: false,
      selectedDate: undefined
    });
  }

  onSaveDaily=(checkin:number)=>{
    if (this.state.selectedDate){
      let datestring = utilities.getDateKeyString(this.state.selectedDate);
      let checkinsTemp = Object.assign({}, this.state.checkins);
      let markedDatesTemp = Object.assign({}, this.state.markedDates);

      if (checkin == 0){
        // Remove checkin from DB
        clearDayCheckin(this.id, this.state.selectedDate);
        // Remove checkin from local collection
        delete checkinsTemp[datestring];
        delete markedDatesTemp[datestring];
        //console.log("Checkin removed for " + this.state.selectedDate);
      }
      else if (checkin == 1){
        // Add checkin to DB
        addDayCheckin(this.id, this.state.selectedDate);
        // Add checkin to local collection
        checkinsTemp[datestring] = checkin;
        markedDatesTemp[datestring] = this.getSelectedDateObject(checkin);
        //console.log("Checkin added for " + this.state.selectedDate);
      }
      else if (checkin == -1){
        // Add checkin to DB as Skipped
        skipDay(this.id, this.state.selectedDate);
        // Add checkin to local collection
        checkinsTemp[datestring] = checkin;
        markedDatesTemp[datestring] = this.getSelectedDateObject(checkin);
        //console.log("Checkin skipped for " + this.state.selectedDate);
      }

      this.setState({
        checkins: checkinsTemp,
        markedDates: markedDatesTemp,
        changesMade: true
      });
    }

    this.clearModal();
  }

  onSaveHourly=(hourCount:number)=>{
    if (this.state.selectedDate){      
      //let date = new Date(this.state.selectedDateString);
      let datestring = utilities.getDateKeyString(this.state.selectedDate);
      let checkinsTemp = Object.assign({}, this.state.checkins);
      let markedDatesTemp = Object.assign({}, this.state.markedDates);

      addHourlyCheckin(this.id, this.state.selectedDate, hourCount);

      // Add checkin to local collection
      if(hourCount == 0){
        delete checkinsTemp[datestring];
        delete markedDatesTemp[datestring];
      }
      else { // HANDLES BOTH Hours>0 AND SKIPPED
        checkinsTemp[datestring] = hourCount;
        markedDatesTemp[datestring] = this.getSelectedDateObject(hourCount);
      }
      
      this.setState({
        checkins: checkinsTemp,
        markedDates: markedDatesTemp,
        changesMade: true
      });
    }

    this.clearModal();
  }
  
  render() {
    let name = this.props.route.params?.name || "";
    let description = this.props.route.params?.description || "";
    let category = this.props.route.params?.category || "";
    let type = this.props.route.params?.type || "";
    let period = this.props.route.params?.period || "";
    let penalty = this.props.route.params?.penalty || "";
    let checkins = this.props.route.params?.checkins || undefined;
    let timesRequired = this.props.route.params?.timesRequired || "";
    let deadline = this.props.route.params?.deadline ? utilities.getDateString(this.props.route.params?.deadline) : "";
    const newCalWidth = Dimensions.get('window').width * 0.9;
    // let showEdit = this.props.route.params?.showEdit;
    // let showArchiveBtn = this.props.route.params?.showArchiveBtn || false;
    // let showEditBtn = this.props.route.params?.showEditBtn || false;
    // let showCopyBtn = this.props.route.params?.showCopyBtn || false;

    return (
      <View style={{flex:1}}>
        <View style={styles.container}>   
          <Text style={styles.heading}>{name}</Text>
          <View style={styles.row}>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.row}>            
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowlabel}>Category:</Text>
            </View>
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowinput}>{category}</Text>
            </View>
          </View>

          <View style={styles.row}>            
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowlabel}>Type:</Text>
            </View>
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowinput}>{type}</Text>
            </View>
          </View>

          { type !== 'oneTime' && type !== 'daily' && (
            <View style={styles.row}>  
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>Period:</Text>
              </View>              
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowinput}>{period}</Text>
              </View>
            </View>
          )}

          { type !== 'daily' && type !== 'oneTime' && (
            <View style={styles.row}>  
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>
                      {type === 'hourly' ? "hours" : "times"} / {period}:
                  </Text>
              </View>            
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowinput}>{timesRequired}</Text>
              </View>
            </View>
          )}

          { type === 'oneTime' && (
            <View style={styles.row}>  
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowlabel}>Deadline:</Text>
              </View>          
              <View style={{justifyContent:'center'}}> 
                  <Text style={styles.rowinput}>{deadline}</Text>
              </View>
            </View>
          )}

          <View style={styles.row}>  
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowlabel}>Penalty ($):</Text>
            </View>         
            <View style={{justifyContent:'center'}}> 
                <Text style={styles.rowinput}>{penalty}</Text>
            </View>
          </View>
          
          { checkins !== undefined && (
            <View style={{width:newCalWidth, height: 340, marginTop:20}}>
              <Calendar            
                // Handler which gets executed on day press. Default = undefined
                //onDayPress={(day) => {console.log('selected day', day)}}
                onDayPress={(day) => this.onDayPress(day)}
                // Handler which gets executed on day long press. Default = undefined
                //onDayLongPress={(day) => this.onDayLongPress(day)}
                current={utilities.getDateKeyString(new Date())}
                markedDates={this.state.markedDates}
              />
            </View>
          )}

          <Modal 
            visible={this.state.isModalVisible}
            animationType={'fade'}
            transparent={true}
            >
            { type === 'hourly' && 
              <HourlyModal 
                navigate={this.props.navigation.navigate}
                checkinHours={this.state.selectedCheckinValue}
                onCancel={this.onCancel}
                onSave={this.onSaveHourly}
                />
            }
            { type !== 'hourly' && 
              <CheckinModal 
                navigate={this.props.navigation.navigate}
                checkinStatus={this.state.selectedCheckinValue}
                onCancel={this.onCancel}
                onSave={this.onSaveDaily}
                />
            }
          </Modal>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headContainerStyle: {
    marginTop: 23,
    backgroundColor: '#1e75ff',
    height:48,
  },
  headBarStyle: {    
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    // borderBottomWidth: 2,
    // borderColor: '#000000'
  },
  headerIconStyle:{
    color: '#fff'
  },
  buttons:{
    marginHorizontal:10
  },
  //--------------------------
  container:{      
    flex:1,
    alignItems: 'center',
    flexDirection: "column",
    backgroundColor: '#ffffff'
  },
  row:{
    flexDirection: 'row',
    paddingVertical: 4,
    width: '85%'
  },
  heading:{
    fontSize:18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  description:{
    fontSize:16,
    fontStyle: "italic",
    marginVertical: 5,
  },
  rowlabel:{    
    fontSize:16,
    textAlign: "right",
  },
  rowinput:{    
    fontSize:16,
    marginLeft: 15,
  }
});