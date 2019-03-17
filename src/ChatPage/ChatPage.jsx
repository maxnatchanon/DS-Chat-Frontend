import React, { Component } from 'react';
import { Layout, message, Modal, Button, Input } from 'antd';
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
            createVisible: false,
            createName: '',
            clientID: 'Max',
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
        // Get joined group -> joinedList
        this.getJoinedGroups();
        // Get all group -> joinGroup
        this.getAllgroup();
    }

    // Get unread messages with uid and gid
    getUnreadMessage = (gid) => {
        axios.get(ip.loadBalancer + '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + gid)
        .then((res) => {
            this.setState({
                ...this.state,
                messages: res.data.messages,
            })
        });
    }

    // Get joined groups -> joinedList
    getJoinedGroups = () => { 
        axios.get(ip.loadBalancer + `/getuserinformation?uid=${cookies.get('uid')}`)
        .then((res) => {
            const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                ...this.state,
                joinedList: myData,
            });
        });
    }

    // Get all groups -> allList
    getAllgroup = () => {
        axios.get(ip.loadBalancer  + '/getgroup')
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
            if (res.data === 'Already joined' || res.data === 'Joined') {
                // TODO: Get unread message -> messages
            }
            else {
                message.error(res.body);
            }
        }).catch((err) => {
            message.error('Join group error')
            console.error(err);
        });
    }
    
    // TODO: ???
    // getMessage = async () => {
    //     let messages = this.state.messages;
    //     await this.state.groupList.map((group) => {

    //         axios.get(ip.loadBalancer+ '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + group._id).then((res) => {

    //             axios.get(ip.loadBalancer + '/getm', { params: { gid: group._id } }).then(function (response) {

    //                 response.data.messages.map((message) => {
    //                     message = {
    //                         ...message,
    //                         user: {
    //                             uid: message.uid,
    //                             username:message.username,
    //                             time: message.timeStamp
    //                         }
    //                     };
    //                     messages.push(message);
    //                 })
    //                 let lastMessage = this.state.lastMessage;
    //                 let unread = this.state.unread;

    //                 unread[group._id] = res.data.messages.length;
    //                 lastMessage[group._id] = response.data.messages[response.data.messages.length - 1].content;

    //                 this.setState({ lastMessage, unread });
    //             }.bind(this)).catch(function (err) {
    //                 console.error(err);
    //             });
    //         }).catch((err) => {
    //             console.error(err);
    //         });
    //     })

    //     this.setState({ messages });
    // }

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
                messages: [],
            });
        });
    }

    // Leave group
    leaveGroup = (gid) => {
        axios.post(ip.loadBalancer + '/leavegroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((res) => {
            this.getJoinedGroups();
            this.setState({
                ...this.state,
                selected: '',
                messages: [],
            });
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
    sendMessage = (msg) => {
        // scroller.scrollTo('Message', {
        //     duration: 1500,
        //     delay: 100,
        //     smooth: true,
        //     containerId: this.state.messages.length-1,
        //     offset: 50, // Scrolls to element + 50 pixels down the page
        //   });
        axios.post(ip.loadBalancer + '/sendm', {
            content: msg,
            uid: cookies.get('uid'),
            gid: this.state.selected
        }).then((res) => {
            console.log(res);
            // TODO: ???
        }).catch((err) => {
            console.error(err);
        });
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

    handleLogOut = () => {
        cookies.remove('isAuthen');
        cookies.remove('username');
        cookies.remove('uid');
        window.location = '/';
    }

    handleSendMessage = (msg) => {
        // TODO: Send Message
        console.log(msg)
    }

    handleCreateGroup = () => {
        this.setState({
            ...this.state,
            createVisible: true,
            createName: '',
        });
    }

    handleCreateGroupSubmit = () => {
        if (this.state.createName !== '') {
            const gid = this.state.createName;
            // TODO: Create new group with gid
        }
        else {
            message.error('Group name cannot be empty')
        }
        
    }

    render() {
        return (
            <Layout className='c-background'>
                <ChatSider
                handleLogOut={this.handleLogOut}
                handleCreateGroup={this.handleCreateGroup}
                handlePopOverChange={this.handlePopOverChange}
                handleMenuSelect={this.handleMenuSelect}
                state={this.state}
                />

                <ChatContent
                messages={this.state.messages}
                clientID={this.state.clientID}
                handleSendMessage={this.handleSendMessage}
                selected={this.state.selected}
                />

                <Modal
                visible={this.state.createVisible}
                onOk={this.handleOk}
                onCancel={() => {this.setState({...this.state, createVisible: false,})}}
                footer={null}
                >
                    <div className='create-container center-child'>
                        <h2>Create new group</h2>
                        <Input
                        placeholder='Group name'
                        value={this.state.createName}
                        onChange={(e)=>{this.setState({...this.state,createName: e.target.value,});
                        }}
                        />
                        <Button onClick={this.handleCreateGroupSubmit}>CREATE</Button>
                    </div>
                </Modal>
            </Layout>
        )
    }

}

export default ChatPage;