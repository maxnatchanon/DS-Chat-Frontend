import React, { Component } from 'react';
import { Layout, message, Modal, Button, Input } from 'antd';
import Cookies from 'universal-cookie';
import 'antd/dist/antd.css';
import './ChatPage.css';
import axios from 'axios';
// import io from 'socket.io-client';
import ip from '../ip';

import ChatSider from './Component/ChatSider';
import ChatContent from './Component/ChatContent';

const cookies = new Cookies();
class ChatPage extends Component {

    // socket = io();

    constructor(props) {
        super(props);
        // cookies.set('uid','Max');
        this.state = {
            joinedList: [{name: 'Group A'}, {name: 'Group B'}, {name: 'Group C'}, {name: 'Group D'},],
            allList: [{name: 'Group A'}, {name: 'Group B'}, {name: 'Group C'}, {name: 'Group D'}, {name: 'Group E'}, {name: 'Group F'},],
            selected: 'jGroup A',
            settingVisible: false,
            createVisible: false,
            createName: '',
            messages: [
                {gid: 'A', uid: 'Max', content: 'Mockup chat incoming.', send_at: new Date()},
                {gid: 'A', uid: 'Max', content: 'https://github.com/manussawee/dissys_miniproject/', send_at: new Date()},
                {gid: 'A', uid: 'Yoss', content: 'Just copy it!', send_at: new Date()},
                {gid: 'A', uid: 'Sun', content: '🔥', send_at: new Date()},
                {gid: 'A', uid: 'Jui', content: 'Why is parallel so easy?', send_at: new Date()},
                {gid: 'A', uid: 'Tan', content: '...', send_at: new Date()},
            ],
        }
    }

    componentDidMount(){
        // Get joined group -> joinedList
        this.getJoinedGroups();
        // Get all group -> joinGroup
        this.getAllgroup();
    }

    // Get joined groups -> joinedList
    getJoinedGroups = () => { 
        axios.get(ip.loadBalancer + `/getuserinformation?uid=${cookies.get('uid')}`)
        .then((res) => {
            const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                ...this.state,
                joinedList: myData,
                messages: [],
                selected: '',
            });
        }).catch((err) => {
            console.error(err);
            message.error('Error getting joined groups');
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
            message.error('Error getting all groups');
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
            if (res.data === 'Already joined') {
                this.getUnreadMessage(gid, false);
            }
            else if (res.data === 'Joined') {
                this.getAllMessage(gid);
            }
            else {
                message.error(res.body);
            }
        }).catch((err) => {
            message.error('Join group error')
            console.error(err);
        });
    }

    // Get unread messages with uid and gid
    getUnreadMessage = (gid, append) => {
        axios.get(ip.loadBalancer + '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + gid)
        .then((res) => {
            this.setState({
                ...this.state,
                messages: (append) ? this.state.messages.push(...res.data.messages) : res.data.messages,
            }, () => {
                const lastMsg = document.getElementById('msg-0');
                lastMsg.scrollIntoView({behavior: 'smooth'});
            })
        }).catch((err) => {
            console.error(err);
            message.error('Error getting unread messages')
        });
    }
    
    getAllMessage = (gid) => {
        axios.get(ip.loadBalancer + '/getm?gid=' + gid)
        .then((res) => {
            this.setState({
                ...this.state,
                messages: res.data.messages,
            }, () => {
                const lastMsg = document.getElementById('msg-0');
                lastMsg.scrollIntoView({behavior: 'smooth'});
            })
        }).catch((err) => {
            console.error(err);
            message.error('Error getting all messages')
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
    createGroup = (name) => {
        axios.post(ip.loadBalancer + '/creategroup', {
            uid: cookies.get('uid'),
            gname: name
        }).then((res) => {
            this.getJoinedGroups();
            console.log(res);
        }).catch((err) => {
            console.error(err);
            message.error('Error creating group')
        });
    };

    // Send new message
    sendMessage = (msg) => {
        // var msgs = this.state.messages;
        // msgs.push({gid: 'A', uid: 'Max', content: msg, send_at: new Date()})
        // console.log(msg);
        // this.setState({
        //     ...this.state,
        //     messages: msgs,
        // }, () => {
        //     const lastMsg = document.getElementById('msg-0');
        //     lastMsg.scrollIntoView({behavior: 'smooth'});
        // })
        axios.post(ip.loadBalancer + '/sendm', {
            content: msg,
            uid: cookies.get('uid'),
            gid: this.state.selected
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
            message.error('Error sending message')
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
        // TODO: Is name == gid ?
        this.selectGroup(e.key);
    }

    handleLogOut = () => {
        cookies.remove('isAuthen');
        cookies.remove('username');
        cookies.remove('uid');
        window.location = '/';
    }

    handleSendMessage = (msg) => {
        // Send Message
        this.sendMessage(msg);
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
            const gname = this.state.createName;
            this.createGroup(gname);
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
                clientID={cookies.get('uid')}
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