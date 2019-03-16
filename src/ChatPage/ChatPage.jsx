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
                
                />
            </Layout>
        )
    }

}

export default ChatPage;