import React from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, Picker, Alert } from 'react-native';
import { List, ListItem, SearchBar, Header, FormValidationMessage, Button } from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import axios from 'axios';
import {GetRequest} from '../helper/request_helper';


export default class AdminOldOrderLook extends React.Component {

    static navigationOptions = {
        headerStyle: { backgroundColor: '#5F5395', height: 40 },
        headerTitleStyle: { color: 'white', alignItems: 'center' },
        title: "Xem Lệnh",
    }

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.state = {
            loading: false,
            access_token : navigation.getParam('access_token', 'access_token'),
            item: navigation.getParam('item', null),
            errorMessage : null
        };
        this._deleteOrder= this._deleteOrder.bind(this);
        this._alertDelete= this._alertDelete.bind(this);
    }  

    _alertDelete(){
        Alert.alert(
            'Xóa lệnh',
            'Bạn có muốn xóa lệnh này không?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this._deleteOrder()},
            ],
            { cancelable: false }
          )
    }

    _deleteOrder() {
        const itemId = this.state.item.id;
        axios.delete(`https://tinhieu-backend.herokuapp.com/admin/notification/` + itemId, 
        {
            headers: {
                "Authorization" : "Bearer " + this.state.access_token
            }
        })
        .then(res => {
            const data = res.data;
            console.log(data);
            this.setState({errorMessage: "Cắt lệnh thành công"})
        })
        .then(res => {
            const { navigation } = this.props;
            navigation.goBack();
        })
        .catch(error =>{
            console.log(error.response);
            this.setState({errorMessage: "Cắt lệnh không thành công"})
            console.log(this.access_token);
        })
    }


    render() {
        return (

            <View style = {styles.container}>
                <ListItem 
                    title={this.state.item.currency_code}
                    titleStyle = {styles.textStyle}
                    subtitle= {"" + this.state.item.time_open.split(' ')[1].split('.')[0]}
                    containerStyle={{ height: 50 }}
                    hideChevron
                />
                <ListItem 
                    title={this.state.item.buy_or_sell == 0 ? "MUA": "BÁN"}
                    titleStyle = {styles.textStyle}
                    rightTitle={"" + this.state.item.price}
                    containerStyle={{ height: 50 }}
                    hideChevron
                />
                <ListItem
                    title={`Take Profit #1`}
                    titleStyle = {{color : "green"}}
                    rightTitle={"" + this.state.item.take_profit_one}
                    containerStyle = {{borderBottomWidth : 0, height : 35}}
                    hideChevron
                />
                <ListItem
                    title={`Take Profit #2`}
                    titleStyle = {{color : "green"}}
                    rightTitle={"" + this.state.item.take_profit_two}
                    containerStyle={{ borderBottomWidth : 0, height: 35}}
                    hideChevron
                />
                <ListItem
                    title={`Take Profit #3`}
                    titleStyle = {{color : "green"}}
                    rightTitle={"" + this.state.item.take_profit_three}
                    containerStyle={{ borderBottomWidth : 0, height: 35 }}
                    hideChevron
                />
                <ListItem
                    title={`Stop Loss`}
                    titleStyle = {{color : "red"}}
                    rightTitle={"" + this.state.item.stop_loss}
                    containerStyle={{ height: 35 }}
                    hideChevron
                />
                <View style = {styles.resContainer}>
                {this.state.value == 'news'? <Text style = {styles.successTitleStyle} > TAKE PROFIT </Text> : <Text style = {styles.failTitleStyle}> STOP LOSS </Text> }
                </View>
                <View style = {styles.rowContainer}>
                    <Button 
                        buttonStyle = {styles.buttonSL}
                        title="Xóa lệnh"
                        textStyle = {styles.buttonText}
                        containerViewStyle = {styles.buttonContainer}
                        onPress = {this._alertDelete}
                    />

                </View>
                    <FormValidationMessage>
                        {this.state.errorMessage}
                    </FormValidationMessage>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor: 'black'
    },
    resContainer: {
        height: 30,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContainer: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    inputBox:{
        width:350,
        height:50,
        backgroundColor: '#5F5395',
        borderRadius: 10,
        paddingHorizontal: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    buttonTP:{
        width:100,
        height:50,
        backgroundColor: 'green',
        borderRadius: 15,
    },
    buttonSL:{
        width:100,
        height:50,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    successTitleStyle:{
        fontSize: 16,
        fontWeight: 'bold',
        color: "green"
      },
    failTitleStyle:{
        fontSize: 16,
        fontWeight: 'bold',
        color: "red"
    },
    buttonContainer:{
        paddingVertical: 10,
    },
    textStyle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff"
    },
});
