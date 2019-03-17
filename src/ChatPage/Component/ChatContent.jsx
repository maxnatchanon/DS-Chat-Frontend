import React, { Component } from 'react';
import { Layout, Divider, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './ChatContent.css';

export default class ChatContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMessage: '',
            disableSend: true,
        }
    }

    handleInputChange = (e) => {
        this.setState({
            ...this.state,
            inputMessage: e.target.value,
        }, () => {
            this.checkSendable();
        });
        
    }

    checkSendable = () => {
        const notSendable = (this.state.inputMessage.trim() === '');
        this.setState({
            ...this.state,
            disableSend: notSendable,
        });
    }

    render() {
        const {Content} = Layout;
        return (
            <Content className='chat-content-container'>
                <div className='chat-content-header center-child'>
                    { this.props.selected.slice(1, this.props.selected.length) }
                </div>
                <div className='chat-content-divider'><Divider/></div>
                <div className='chat-message-container'>
                    { this.props.messages.map((msg,idx) => 
                        <Message key={idx}
                        message={{text: msg.message, sender: msg.clientID, timestamp: msg.timestamp}}
                        uid={this.props.clientID}
                        /> 
                    ) }
                </div>
                <div className='message-input-container'>
                    <Divider className='chat-input-divider'/>
                    <div>
                        <Input onChange={this.handleInputChange}></Input>
                        <Button 
                        disabled={this.state.disableSend}
                        onClick={(e)=>this.props.handleSendMessage(this.state.inputMessage.trim())}>
                            SEND
                        </Button>
                    </div>
                </div>
            </Content>
        );
    }
}

class Message extends Component {
    // { { text, sender, timestamp }, uid }

    render() {
        const isMyMsg = (this.props.message.sender === this.props.uid);
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