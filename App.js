import React, {Component} from 'react';
import {Platform, StyleSheet, FlatList, ActivityIndicator, Text, View, Button} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {isLoading: true}
    }

    componentDidMount() {
        return this.fetchDataFromServer();
    }

    fetchDataFromServer = () => {
        fetch('http://192.168.1.44:8080/event/all')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson.response,
                }, function () {

                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    postDataToServer = () => {
        this.state = {isLoading: true};
        fetch('http://192.168.1.44:8080/event/add', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                articleId: 10,
                value: 432,
                year: 2019,
                month: 1,
                day: 18,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.fetchDataFromServer();
                return responseJson.response;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <Text style={styles.content_header}>FiNaNCe</Text>
                <Button title="Fetch" onPress={this.fetchDataFromServer}/>
                <Button title="Add" onPress={this.postDataToServer}/>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={
                        ({item}) =>
                            <Text style={styles.content_text}>
                                {item.year}.{item.month}.{item.day} ({item.article.name}) {item.value}
                            </Text>
                    }
                    keyExtractor={({id}, index) => id}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282c34',
    },
    content_header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#AAAAAA',
    },
    content_text: {
        textAlign: 'center',
        color: '#AAAAAA',
        marginBottom: 5,
    },
});
