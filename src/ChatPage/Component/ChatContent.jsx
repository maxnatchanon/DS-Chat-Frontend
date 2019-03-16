import React, { Component } from 'react';
import { Layout, Divider, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './ChatContent.css';

export default class ChatContent extends Component {
    render() {
        const {Content} = Layout;
        return (
            <Content className='chat-content-container'>
                <div className='chat-content-header center-child'>Group A</div>
                <div className='chat-content-divider'><Divider/></div>
                <div className='chat-message-container'>
                    <Message
                        message={{text: 'Hi, how are you?', sender: 'A', timestamp: '2.22 AM'}}
                        uid={'B'}
                    />
                    <Message
                        message={{text: "I'm fine!", sender: 'B', timestamp: '2.24 AM'}}
                        uid={'B'}
                    />
                </div>
                <div className='message-input-container'>
                    <Divider className='chat-input-divider'/>
                    <div>
                        <Input></Input>
                        <Button>SEND</Button>
                    </div>
                </div>
            </Content>
        );
    }
}

class Message extends Component {
    // { { text, sender, timestamp }, uid }

    render() {
        const isMyMsg = (this.props.message.sender == this.props.uid);
        return (
            <div className={'message-container message-' + ((isMyMsg) ? 'right' : 'left')}>
                <div className='sender'>
                    { this.props.message.sender }
                </div>
                <div className={'message-time-container-' + ((isMyMsg) ? 'right' : 'left')}>
                    <div className={'message message-bg-' + ((isMyMsg) ? 'right' : 'left')}>
                        { this.props.message.text }
                    </div>
                    <div className='timestamp'>
                        { this.props.message.timestamp }
                    </div>
                </div>
                
            </div>
        );
    }
}