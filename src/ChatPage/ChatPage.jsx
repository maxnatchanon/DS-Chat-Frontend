import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './ChatPage.css';

import ChatSider from './Component/ChatSider';
import ChatContent from './Component/ChatContent';

class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            joinedList: ['Group A', 'Group B', 'Group C', 'Group D'],
            allList: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G'],
            selected: 'jGroup A',
            settingVisible: false,
            clientID: 'Max',
            selectedGroup: 'Group A',
            messages: [
                {message: 'Hi! How are you?', timestamp: '23.30 PM', clientID: 'Sun'},
                {message: 'I\'m fine. Thanks!', timestamp: '23.34 PM', clientID: 'Max'},
                {message: 'https://github.com/manussawee/dissys_miniproject', timestamp: '23.38 PM', clientID: 'Max'},
                {message: 'Just copy it!', timestamp: '23.39 PM', clientID: 'Yoss'},
                {message: 'Why parallel is so easy?', timestamp: '23.39 PM', clientID: 'Jui'},
                {message: '...', timestamp: '23.39 PM', clientID: 'Tan'},
            ],
        }
    }

    handlePopOverChange = (visible) => {
        this.setState({
            ...this.state,
            settingVisible: visible,
        })
    }

    handleMenuSelect = (e) => {
        this.setState({
            ...this.state,
            selected: e.key,
        })
        // TODO: Change chat content / Show join dialog
    }

    handleAddGroup = () => {
        // TODO: Show add group form
    }

    handleLogOut = () => {
        // TODO: Log out
    }

    handleSendMessage = (msg) => {
        // TODO: Send Message
        console.log(msg)
    }

    render() {
        return (
            <Layout className='c-background'>
                <ChatSider
                handleLogOut={this.handleLogOut}
                handleAddGroup={this.handleAddGroup}
                handlePopOverChange={this.handlePopOverChange}
                handleMenuSelect={this.handleMenuSelect}
                state={this.state}
                />
                <ChatContent
                messages={this.state.messages}
                clientID={this.state.clientID}
                handleSendMessage={this.handleSendMessage}
                selectedGroup={this.state.selectedGroup}
                />
            </Layout>
        )
    }

}

export default ChatPage;