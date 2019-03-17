import React, { Component } from 'react';
import { Layout } from 'antd';
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
    socket = io(); //ip
     state = {
        isJoin : [],
        message: '',
        messages: [],
        lastMessage: {

        },
        unread: {

        },
        username: {

        },
        groupList: [],
        joinedGroups: [],
       // isShowingModal: false,
        newGroupName: '',
        selectedGroupID: '',
        selectGroupName: '', 
        messageOrder: -1,
    };
    componentDidMount(){
         axios.get(/*IpList.loadBalancer */+ '/getm').then((res) => {
            
            this.setState({messageOrder: res.data.messageOrder}, () => {

                this.socket.on('chat', (result) => {

                    if (this.state.messageOrder + 1 == result.messageOrder) {

                        this.setState({
                            messageOrder: result.messageOrder
                        });

                        let messages = this.state.messages.slice();
                        let lastMessage = this.state.lastMessage;
                        //  message = { ...message, user: { uid: message.uid , username:message.user.name} };
                        messages.push({ ...result.message,
                            user: {
                                uid: result.message.uid,
                                username: result.message.username,
                                time : result.message.timeStamp
                            }
                        });
                        lastMessage[result.message.gid] = result.message.content;
                        this.setState({
                            messages,
                            lastMessage
                        });

                        if (this.state.selectedGroupID == result.message.gid) {
                            axios.post(IpList.loadBalancer + '/setReadAt', {
                                uid: cookies.get('uid'),
                                gid: result.message.gid

                            }).then(() => {

                                this.getUnread(result.message.gid);
                            });
                        }

                        this.getUnread(result.message.gid);
                        this.getJoinedGroups();
                    } else {
                        this.getAllGroup();
                        this.getJoinedGroups();
                    }
                });
            });
        });

        this.getAllGroup();
        this.getJoinedGroups();

        const node = this.refs.trackerRef;  //scroll to bottom
        node && node.scrollIntoView({block: "end"})

    }
    getunreadm = (gid) => { // get Unread message

        axios.get(/*IP???*/ + '/getunreadm?uid=' + gid).then((res) => { //getUnread with group ID and UID
            let unread = this.state.unread;
            
            unread[gid] = res.data.messages.length;
            this.setState({
                unread
            });
        })
    }
    getJoinedGroups = () => { // get Group which User joined
        axios.get(/*IP???*/+ `/getuserinformation?uid=${cookies.get('uid')}`).then((res) => {

            const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                joinedGroups: myData
            });
        });
    }
    getAllgroup = () => { //get All group in chat server
         axios.get(/*IP???*/  + '/getAllGroup').then(function (response) {
            this.setState({ groupList: response.data }, this.getMessage)

        }.bind(this)).catch(function (err) {
            console.error(err);
        });
    }

    selectGroup = (gid, gname) => { // user selecte group to read message
  //      const GID = gid;
        this.setState({
            selectedGroupID: gid,
            selectGroupName: gname
        });

        axios.post(/*IP???*/  + '/joingroup', {
            uid: cookies.get('uid'),
            gid: gid 
        }).then(function (response) {
           
            this.getJoinedGroups();

            axios.post(/*IP???*/  + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {

                this.getunreadm(gid);

            });
        }.bind(this)).catch(function (err) {
            console.error(err);
            axios.post(/*IP???*/ + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {

                this.getunreadm(gid);
            });
        });
    }
    
     getMessage = async () => {
        let messages = this.state.messages;
        await this.state.groupList.map((group) => {

            axios.get(/*IP???*/+ '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + group._id).then((res) => {

                axios.get(/*IP???*/ + '/getm', { params: { gid: group._id } }).then(function (response) {

                    response.data.messages.map((message) => {

                        message = { ...message, user: { uid: message.uid , username:message.username,time 
                        : message.timeStamp} };
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
            }, (err) => { console.error(err)});
        })

        this.setState({ messages });
    }
    leaveGroup = (gid) => {
        axios.post(/*IP???*/ + '/exitgroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((result) => {
            this.getJoinedGroups();
            this.setState({
                selectedGroupID: '',
                selectGroupName: '',
            });
        });
    }

    createGroup = () => {
        axios.post(/*IP???*/ + '/creategroup', {
            uid: cookies.get('uid'),
            gname: this.state.newGroupName,
        }).then(function (response) {
            
        }).catch(function (err) {
            console.error(err);
        });
    };

     sendMessage = () => {
        // scroller.scrollTo('Message', {
        //     duration: 1500,
        //     delay: 100,
        //     smooth: true,
        //     containerId: this.state.messages.length-1,
        //     offset: 50, // Scrolls to element + 50 pixels down the page
        //   });
        axios.post(/*IP???*/+ '/sendm', {
            message: this.state.text ,
            uid: cookies.get('uid'),
            gid: this.state.selectedGroupID // CHANGE gid MANUALLY
        }).then(function (response) {

        }).catch(function (err) {
            console.error(err);
        });

        this.setState({ text: '' });   
    }

    socket = io(); //ip

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

    componentDidMount = () => {
        axios.get(ip.loadBalancer + '/getmessageorder').then((res) => {

        });
    }

    getUnreadMessage = (gid) => { // get Unread message

        axios.get(ip.loadBalancer + '/getunreadm?uid=' + gid).then((res) => { //getUnread with group ID and UID
            let unread = this.state.unread;
            
            unread[gid] = res.data.messages.length;
            this.setState({
                ...this.state,
                messages: []
            });
        })
    }

    getJoinedGroups = () => { // get Group which User joined
        axios.get(ip.loadBalancer + `/getuserinformation?uid=${cookies.get('uid')}`).then((res) => {

            const myData = res.data.groups.length ? [...res.data.groups].sort((x, y) => x.name.localeCompare(y.name) ) : [];
            this.setState({
                joinedGroups: myData
            });
        });
    }

    getAllgroup = () => { //get All group in chat server
         axios.get(ip.loadBalancer  + '/getAllGroup').then(function (response) {
            this.setState({ groupList: response.data }, this.getMessage)

        }.bind(this)).catch(function (err) {
            console.error(err);
        });
    }

    selectGroup = (gid, gname) => { // user selecte group to read message
        // const GID = gid;
        this.setState({
            selectedGroupID: gid,
            selectGroupName: gname
        });

        axios.post(ip.loadBalancer  + '/joingroup', {
            uid: cookies.get('uid'),
            gid: gid 
        }).then(function (response) {
           
            this.getJoinedGroups();

            axios.post(ip.loadBalancer  + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {

                this.getunreadm(gid);

            });
        }.bind(this)).catch(function (err) {
            console.error(err);
            axios.post(ip.loadBalancer + '/setread', {
                uid: cookies.get('uid'),
                gid: gid
            }).then(() => {

                this.getunreadm(gid);
            });
        });
    }
    
    getMessage = async () => {
        let messages = this.state.messages;
        await this.state.groupList.map((group) => {

            axios.get(ip.loadBalancer + '/viewunreadm?uid=' + cookies.get('uid') + '&gid=' + group._id).then((res) => {

                axios.get(ip.loadBalancer + '/getm', { params: { gid: group._id } }).then(function (response) {

                    response.data.messages.map((message) => {

                        message = { ...message, user: { uid: message.uid , username:message.username,time 
                        : message.timeStamp} };
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
            }, (err) => { console.error(err)});
        })

        this.setState({ messages });
    }
    leaveGroup = (gid) => {
        axios.post(ip.loadBalancer + '/exitgroup', {
            uid: cookies.get('uid'),
            gid: gid,
        }).then((result) => {
            this.getJoinedGroups();
            this.setState({
                selectedGroupID: '',
                selectGroupName: '',
            });
        });
    }

    createGroup = () => {
        axios.post(ip.loadBalancer + '/creategroup', {
            uid: cookies.get('uid'),
            gname: this.state.newGroupName,
        }).then(function (response) {
            
        }).catch(function (err) {
            console.error(err);
        });
    };

    sendMessage = () => {
        // scroller.scrollTo('Message', {
        //     duration: 1500,
        //     delay: 100,
        //     smooth: true,
        //     containerId: this.state.messages.length-1,
        //     offset: 50, // Scrolls to element + 50 pixels down the page
        //   });
        axios.post(ip.loadBalancer+ '/sendm', {
            message: this.state.text ,
            uid: cookies.get('uid'),
            gid: this.state.selectedGroupID // CHANGE gid MANUALLY
        }).then(function (response) {

        }).catch(function (err) {
            console.error(err);
        });

        this.setState({ text: '' });   
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