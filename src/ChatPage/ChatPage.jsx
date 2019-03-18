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

    socket = io(ip.socketServer);
    pollInterval = null;

    constructor(props) {
        super(props);
        this.state = {
            joinedList: [],
            allList: [],
            selectedKey: '',
            selectedGid: '',
            selectedGroup: '',
            settingVisible: false,
            createVisible: false,
            createName: '',
            messages: [],
        }
    };

    componentDidMount(){
        // Get joined group -> joinedList
        this.getJoinedGroups();
        // Get all group -> joinGroup
        this.getAllgroup();
        // Load mockup data
        // this.loadMockupData();
        this.socket.emit('connection', {content: 'HI'});
        this.socket.on('chat', (res) => {
            var messages = this.state.messages;
            messages.push(res.message)
            this.setState({
                ...this.state,
                messages: messages,
            }, () => {
                const lastMsg = document.getElementById('msg-0');
                lastMsg.scrollIntoView({behavior: 'smooth'});
            });
        });
    };

    // ====================================================

    // Get joined groups -> joinedList
    // Replace this.state.joinedList with joined groups list
    // GET /getuserinformation
    // Parameter: uid
    getJoinedGroups = () => { 
        axios.get(ip.loadBalancer + `/getuserinformation?uid=${cookies.get('uid')}`)
        .then((res) => {
            if (res.data === 'ERROR') throw 'asd';
            const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                ...this.state,
                joinedList: myData,
            });
        }).catch((err) => {
            console.error(err);
            message.error('Error getting joined groups');
        });
    };

    // Get all groups -> allList
    // Replace this.state.allList with all groups list
    // GET /getgroup
    // Parameter: -
    getAllgroup = () => {
        axios.get(ip.loadBalancer  + '/getgroup')
        .then((res) => {
            if (res.data === 'ERROR') throw 'asd';
            this.setState({
                ...this.state,
                allList: res.data,
            });
        }).catch((err) => {
            console.error(err);
            message.error('Error getting all groups');
        });
    };

    // Select group from sider
    // Join selected group and get unread or all messages
    // If joining successful, start polling
    // POST /joingroup
    // Parameter: uid, gid
    selectGroup = (gid) => {
        // this.stopPolling();

        // Join group
        axios.post(ip.loadBalancer  + '/joingroup', {
            uid: cookies.get('uid'),
            gid: gid,
            header: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((res) => {
            if (res.data === 'Already joined') {
                this.getUnreadMessage(gid, false);
                this.setState({
                    ...this.state,
                    selectedGid: gid,
                });
            }
            else if (res.data === 'Joined') {
                this.getAllMessage(gid);
                this.setState({
                    ...this.state,
                    selectedGid: gid,
                });
            }
            else {
                message.error(res.body);
            }
        }).catch((err) => {
            message.error('Error joining group')
            console.error(err);
            this.setState({
                ...this.state,
                selectedKey: '',
                selectedGroup: '',
                messages: [],
            });
        });
    };

    // Get unread messages
    // Replace this.state.messages with unread messages
    // Set [append] option to 'true' to append new data to the old one instread of replace
    // GET /viewunreadm
    // Parameter: uid, gid
    getUnreadMessage = (gid, append) => {
        axios.get(ip.loadBalancer + '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + gid)
        .then((res) => {
            this.setState({
                ...this.state,
                messages: (append) ? this.state.messages.push(...res.data.messages) : res.data.messages,
            }, () => {
                const lastMsg = document.getElementById('msg-0');
                if (lastMsg) lastMsg.scrollIntoView({behavior: 'smooth'});
            });
        }).catch((err) => {
            console.error(err);
            message.error('Error getting unread messages');
        });
    };
    
    // Get all messages
    // Replace this.state.message with all messages in the group
    // GET /getm
    // Parameter: gid
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
    };

    // Exit group
    // Tomporary leave group and clear this.state.messages and selectedGroup/Key
    // POST /exitgroup
    // Parameter: uid, gid
    exitGroup = (gid) => {
        axios.post(ip.loadBalancer + '/exitgroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((res) => {
            this.getJoinedGroups();
            this.setState({
                ...this.state,
                selectedKey: '',
                selectedGroup: '',
                messages: [],
            });
        });
    };

    // Leave group
    // POST /leavegroup
    // Parameter: uid, gid
    leaveGroup = (gid) => {
        axios.post(ip.loadBalancer + '/leavegroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((res) => {
            this.getJoinedGroups();
            this.setState({
                ...this.state,
                selectedKey: '',
                selectedGroup: '',
                messages: [],
            });
        }).catch((err) => {
            console.error(err);
            message.error('Error leaving group')
        });
    };

    // Create new group
    // Refresh joined list and all list after created
    // POST /creategroup
    // Parameter: uid, gname
    createGroup = (name) => {
        axios.post(ip.loadBalancer + '/creategroup', {
            uid: cookies.get('uid'),
            gname: name
        }).then((res) => {
            this.getJoinedGroups();
            this.getAllgroup();
            console.log(res);
        }).catch((err) => {
            console.error(err);
            message.error('Error creating group')
        });
    };

    // Send new message
    // POST /sendm
    // Parameter: uid, gid, content
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
        // return;
        axios.post(ip.loadBalancer + '/sendm', {
            content: msg,
            uid: cookies.get('uid'),
            gid: this.state.selectedGroup
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
            message.error('Error sending message')
        });
    };


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

    // ====================================================

    loadMockupData = () => {
        cookies.set('uid','Max');
        this.setState({
            joinedList: [{name: 'Group A'}, {name: 'Group B'}, {name: 'Group C'}, {name: 'Group D'},],
            allList: [
                {name: 'Group A'}, {name: 'Group B'}, {name: 'Group C'}, {name: 'Group D'}, {name: 'Group E'}, {name: 'Group F'},
                {name: 'Group G'}, {name: 'Group H'}, {name: 'Group I'}, {name: 'Group J'}, {name: 'Group K'},
            ],
            selectedKey: 'jGroup A',
            selectedGroup: 'Group A',
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
        })
    }

    // Set visibility of logout popover
    handlePopOverChange = (visible) => {
        this.setState({
            ...this.state,
            settingVisible: visible,
        })
    };

    // Set selectedKey and send join request
    handleMenuSelect = (e) => {
        const idx = parseInt(e.key.slice(1,e.key.length));
        var gid = '';
        var gname = '';
        if (e.key.slice(0,1) === 'j') {
            gid = this.state.joinedList[idx]._id;
            gname = this.state.joinedList[idx].name;
        }
        else {
            gid = this.state.allList[idx]._id;
            gname = this.state.allList[idx].name;
        }

        this.setState({
            ...this.state,
            selectedKey: e.key,
            selectedGid: gid,
            selectedGroup: gname,
        })
        this.selectGroup(gid);
    };

    handleLogOut = () => {
        cookies.remove('isAuthen');
        cookies.remove('username');
        cookies.remove('uid');
        window.location = '/';
    };

    handleSendMessage = (msg) => {
        // Send Message
        this.sendMessage(msg);
    };

    handleCreateGroup = () => {
        this.setState({
            ...this.state,
            createVisible: true,
            createName: '',
        });
    };

    handleCreateGroupSubmit = () => {
        if (this.state.createName !== '') {
            const gname = this.state.createName;
            this.createGroup(gname);
        }
        else {
            message.error('Group name cannot be empty')
        }
    }

    handleLeaveGroup = () => {
        this.leaveGroup(this.state.selectedGid)
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
                selectedGroup={this.state.selectedGroup}
                handleLeaveGroup={this.handleLeaveGroup}
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
                        onChange={(e)=>{this.setState({...this.state,createName: e.target.value,})}}
                        />
                        <Button onClick={this.handleCreateGroupSubmit}>CREATE</Button>
                    </div>
                </Modal>
            </Layout>
        )
    }

}

export default ChatPage;