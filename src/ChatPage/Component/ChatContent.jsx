import React, { Component } from 'react';
import { Layout, Divider, Input, Button, Icon, Popconfirm } from 'antd';
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

    componentDidMount = () => {
        window.onkeyup = (e) => {
            const key = e.keyCode ? e.keyCode : e.which;
            const disabled = this.state.disableSend;
            if (document.activeElement.id === 'message-input' && key === 13) {
                if (!disabled) {
                    this.props.handleSendMessage(this.state.inputMessage.trim());
                    this.setState({...this.state, inputMessage: '',})
                }
            }
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
        const notSelected = (this.props.selectedGroup === '');
        this.setState({
            ...this.state,
            disableSend: (notSendable || notSelected),
        });
    }

    render() {
        const {Content} = Layout;
        return (
            <Content className='chat-content-container'>
                <div className='chat-content-header center-child'>
                    <span>{ this.props.selectedGroup }</span>
                    <span className='leaveButton' style={{visibility: ((this.props.selectedGroup === '') ?  'hidden' : 'visible')}}>
                        <Popconfirm
                        placement='bottomRight'
                        title={'Leave group?'}
                        onConfirm={this.props.handleLeaveGroup}
                        okText='Confirm' cancelText='Cancel'
                        >
                            <Icon type='logout' />
                        </Popconfirm>
                    </span>
                </div>
                <div className='chat-content-divider'><Divider/></div>
                <div className='chat-message-container'>
                    { this.props.messages.map((msg,idx) => 
                        <Message key={idx}
                        id={'msg-' + (this.props.messages.length - idx - 1)}
                        message={{text: msg.content, sender: msg.uid, timestamp: msg.send_at}}
                        uid={this.props.clientID}
                        /> 
                    ) }
                </div>
                <div className='message-input-container'>
                    <Divider className='chat-input-divider'/>
                    <div>
                        <Input id='message-input' disabled={this.props.selectedGroup === ''} onChange={this.handleInputChange} value={this.state.inputMessage}></Input>
                        <Button 
                        disabled={this.state.disableSend}
                        onClick={(e)=>{
                            this.props.handleSendMessage(this.state.inputMessage.trim());
                            this.setState({...this.state, inputMessage: '',})
                        }}>
                            SEND
                        </Button>
                    </div>
                </div>
            </Content>
        );
    }
}

class Message extends Component {

    formatDate = (date) => {
        var res = '';
        try {
            res = date.getHours() + ':' + date.getMinutes();
        }
        catch {
            res = '';
        }
        return res;
    }

    render() {
        const isMyMsg = (this.props.message.sender === this.props.uid);
        return (
            <div className={'message-container message-' + ((isMyMsg) ? 'right' : 'left')} id={this.props.id}>
                <div className='sender'>
                    { this.props.message.sender }
                </div>
                <div className={'message-time-container-' + ((isMyMsg) ? 'right' : 'left')}>
                    <div className={'message message-bg-' + ((isMyMsg) ? 'right' : 'left')}>
                        { this.props.message.text }
                    </div>
                    <div className='timestamp'>
                        { this.formatDate(this.props.message.timestamp) }
                    </div>
                </div>
                
            </div>
        );
    }
}