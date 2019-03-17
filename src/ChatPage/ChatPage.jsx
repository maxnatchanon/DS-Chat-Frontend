import React, { Component } from 'react';
import { Layout, message } from 'antd';
import Cookies from 'universal-cookie';
import 'antd/dist/antd.css';
import './ChatPage.css';
import axios from 'axios';
import io from 'socket.io-client';
import ip from '../ip';

import ChatSider from './Component/ChatSider';
import ChatContent from './Component/ChatContent';

const cookies = new Cookies();
class ChatPage extends Component {

    socket = io();

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

    componentDidMount(){
        // TODO: Get joined group -> joinedList
        // TODO: Get all group -> joinGroup
    }

    // Get unread messages with uid and gid
    getUnreadMessage = (gid) => {
        axios.get(ip.loadBalancer + '/getunreadm?uid=' + cookies.get('uid') + '&gid=' + gid)
        .then((res) => {
            // TODO: Set messages to response messages
        });
    }

    // Get joined groups -> joinedList
    getJoinedGroups = () => { 
        axios.get(ip.loadBalancer + `/getuserinformation?uid=${cookies.get('uid')}`)
        .then((res) => {
            // const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                ...this.state,
                joinedList: res.data.groups,
            });
        });
    }

    // Get all groups -> allList
    getAllgroup = () => {
        axios.get(ip.loadBalancer  + '/getAllGroup')
        .then(function (res) {
            this.setState({
                ...this.state,
                allList: res.data,
            })
        }).catch((err) => {
            console.error(err);
        });
    }

    // Select group from sider
    selectGroup = (gid) => {
        this.setState({
            ...this.state,
            selected: gid,
        });

        // Join group
        axios.post(ip.loadBalancer  + '/joingroup', {
            uid: cookies.get('uid'),
            gid: gid 
        }).then((res) => {
            // Refresh joined group
            this.getJoinedGroups();
            // Set read message
            axios.post(ip.loadBalancer  + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {
                this.getUnreadMessage(gid);
            });
        }).catch((err) => {
            message.error('Join group error')
            console.error(err);
            axios.post(ip.loadBalancer + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {
                this.getUnreadMessage(gid);
            });
        });
    }
    
    // TODO: ???
    getMessage = async () => {
        let messages = this.state.messages;
        await this.state.groupList.map((group) => {

            axios.get(ip.loadBalancer+ '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + group._id).then((res) => {

                axios.get(ip.loadBalancer + '/getm', { params: { gid: group._id } }).then(function (response) {

                    response.data.messages.map((message) => {
                        message = {
                            ...message,
                            user: {
                                uid: message.uid,
                                username:message.username,
                                time: message.timeStamp
                            }
                        };
                        messages.push(message);
                    })
                    let lastMessage = this.state.lastMessage;
                    let unread = this.state.unread;

                    unread[group._id] = res.data.messages.length;
                    lastMessage[group._id] = response.data.messages[response.data.messages.length - 1].content;

                    this.setState({ lastMessage, unread });
                }.bind(this)).catch(function (err) {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        })

        this.setState({ messages });
    }

    // Exit group
    exitGroup = (gid) => {
        axios.post(ip.loadBalancer + '/exitgroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((res) => {
            this.getJoinedGroups();
            this.setState({
                ...this.state,
                selected: '',
            });
        });
    }

    // Leave group
    leaveGroup = (gid) => {
        axios.post(ip.loadBalancer + '/leavegroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((res) => {
            // TODO: Do something
        });
    }

    // Create new group
    createGroup = () => {
        axios.post(ip.loadBalancer + '/creategroup', {
            uid: cookies.get('uid'),
            gname: this.state.newGroupName, // TODO: Create this state
        }).then((res) => {
            
        }).catch((err) => {
            console.error(err);
        });
    };

    // Send new message
    sendMessage = () => {
        // scroller.scrollTo('Message', {
        //     duration: 1500,
        //     delay: 100,
        //     smooth: true,
        //     containerId: this.state.messages.length-1,
        //     offset: 50, // Scrolls to element + 50 pixels down the page
        //   });
        axios.post(ip.loadBalancer + '/sendm', {
            message: this.state.text, // TODO: Create this state
            uid: cookies.get('uid'),
            gid: this.state.selected
        }).then((res) => {

        }).catch((err) => {
            console.error(err);
        });

        this.setState({ text: '' }); // TODO: Clear state 
    }

    // Get unread message
    getUnreadMessage = (gid) => {
        axios.get(ip.loadBalancer + '/getunreadm?uid=' + gid).then((res) => { //getUnread with group ID and UID
            let unread = this.state.unread;
            
            unread[gid] = res.data.messages.length;
            this.setState({
                ...this.state,
                messages: []
            });
        })
    }

    // ====================================================

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