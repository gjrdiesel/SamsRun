import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';

import Store from 'react-native-store';
import Calendar from 'react-native-calendar';
import moment from 'moment';

const DB = {
    'runs': Store.model('runs')
}

const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f7f7f7',
    },
});

export default class samsrun extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: moment().format(),
            eventDates: [],
            dataToday: {}
        };
    }

    componentWillMount()
    {
        DB.runs.find().then(eventDates=>this.setState({eventDates}))
    }

    selectDate(date)
    {
        const time = moment(date).format('MMMM DD YYYY');

        DB.runs.find({
            where: {date:time}
        }).then(dataToday=>{
            if(dataToday){
                this.setState({
                    selectedDate: date,
                    dataToday: dataToday[0]
                })
            } else {
                this.setState({
                    selectedDate: date,
                    dataToday: {}
                })
            }
        })
    }

    save = ({field,value}) =>
    {
        const time = moment(this.state.selectedDate).format('MMMM DD YYYY');

        DB.runs.find({
            where: {date:time}
        }).then(result=>{
            console.log(result)
            if(result && result[0]){
                result[0][field] = value;
                DB.runs.updateById(result[0],result[0]._id)
            } else {
                let run = {
                    date:time
                };
                run[field] = value;
                DB.runs.add(run)
            }
        })

        let state = {};

        if(this.state.dataToday){
            state = this.state.dataToday;
        }

        state[field] = value;

        this.setState({
            dataToday: state
        })
    }

    render() {

        const time = moment(this.state.selectedDate).format('MMMM DD YYYY');

        return (
            <View style={styles.container}>
                <Calendar style={{ flex: 1 }}
                    ref="calendar"
                    eventDates={this.state.eventDates}
                    events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
                    scrollEnabled
                    showControls
                    dayHeadings={customDayHeadings}
                    monthNames={customMonthNames}
                    titleFormat={'MMMM YYYY'}
                    prevButtonText={'Prev'}
                    nextButtonText={'Next'}
                    onDateSelect={(date) => this.selectDate(date)}
                    onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
                    onTouchNext={(e) => console.log('onTouchNext: ', e)}
                    onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
                    onSwipeNext={(e) => console.log('onSwipeNext', e)}
                />
                <View style={{ flex: 1, justifyContent: 'space-around', margin: 20,  }}>
                    <Text style={{ fontSize: 24 }}>{time}</Text>
                    <View>
                        <Text>Time:</Text>
                        <TextInput value={this.state.dataToday.time} style={{ width: '100%', height: 30, borderWidth: .5, borderColor: 'grey', backgroundColor: 'white', padding: 5 }} onChangeText={(time)=>this.save({field:'time',value:time})}/>
                    </View>
                    <View>
                        <Text>Distance:</Text>
                        <TextInput value={this.state.dataToday.distance} style={{ width: '100%', height: 30, borderWidth: .5, borderColor: 'grey', backgroundColor: 'white', padding: 5 }} onChangeText={(distance)=>this.save({field:'distance',value:distance})}/>
                    </View>
                    <View>
                        <Text>Pace:</Text>
                        <TextInput value={this.state.dataToday.pace} style={{ width: '100%', height: 30, borderWidth: .5, borderColor: 'grey', backgroundColor: 'white', padding: 5 }} onChangeText={(pace)=>this.save({field:'pace',value:pace})}/>
                    </View>
                    <View>
                        <Text>Type:</Text>
                        <TextInput value={this.state.dataToday.type} style={{ width: '100%', height: 30, borderWidth: .5, borderColor: 'grey', backgroundColor: 'white', padding: 5 }} onChangeText={(type)=>this.save({field:'type',value:type})}/>
                    </View>
                    <View>
                        <Text>Other:</Text>
                        <TextInput value={this.state.dataToday.other} style={{ width: '100%', height: 30, borderWidth: .5, borderColor: 'grey', backgroundColor: 'white', padding: 5 }} onChangeText={(other)=>this.save({field:'other',value:other})}/>
                    </View>
                </View>
            </View>

        );
    }
}

AppRegistry.registerComponent('samsrun', () => samsrun);
