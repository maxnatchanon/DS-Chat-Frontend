import React, { Component } from "react";
import { Button } from 'antd';
import "antd/dist/antd.css";
import './ChatPage.css';
import axios from 'axios';
import io from 'socket.io-client';

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

    render() {
        return (
            <div>
                CHAT PAGE
            </div>
        )
    }

}

export default ChatPage;