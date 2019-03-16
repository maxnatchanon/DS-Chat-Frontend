import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './ChatPage.css';

import ChatSider from './Component/ChatSider';

class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            joinedList: ['Group A', 'Group B', 'Group C', 'Group D'],
            allList: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G'],
            selected: 'j-0',
            settingVisible: false,
        }
    }

    handlePopOverChange = (visible) => {
        this.setState({
            ...this.state,
            settingVisible: visible,
        })
    }

    handleAddGroup = () => {
        // TODO: Show add group form
    }

    handleLogOut = () => {
        // TODO: Log out
    }

    render() {
        const {Content} = Layout;
        return (
            <Layout className='c-background'>
                <ChatSider
                handleLogOut={this.handleLogOut}
                handleAddGroup={this.handleAddGroup}
                handlePopOverChange={this.handlePopOverChange}
                state={this.state}
                />
                <Content>
                    
                </Content>
            </Layout>
        )
    }

}

export default ChatPage;