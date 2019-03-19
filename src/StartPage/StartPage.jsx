import React, { Component } from "react";
import { Button, Input, message } from 'antd';
import Cookies from 'universal-cookie';
import "antd/dist/antd.css";
import './StartPage.css';
import axios from 'axios';
import ip from '../ip';

const cookies = new Cookies();

class StartPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        });
    }

    // Register /Log in using inputted username then go to chat page
    // POST /register
    // Parameter: name
    handleLogIn = () => {
        axios.post(ip.loadBalancer + '/register', { name: this.state.username })
        .then((res) => {
            cookies.set('isAuthen', 'true', { path: '/', maxAge: 60 * 60 * 24 });
            cookies.set('username', this.state.username, { path: '/', maxAge: 60 * 60 * 24 });
            cookies.set('uid', res.data.uid, { path: '/', maxAge: 60 * 60 * 24 });
            window.location = '/chat';
        })
        .catch((err) => {
            message.error('Login error');
            console.error(err);
        });
    }

    render() {
        return (
            <div className='s-background center-child'>
                <div className='login-container'>
                    <div className='header center-child'>F DS For Sure</div>
                    <div className='body center-child'>
                        <Input placeholder='Username' onChange={this.handleUsernameChange} size='large'/>
                        <Button onClick={this.handleLogIn}>LOG IN</Button>
                    </div>
                </div>
            </div>
        )
    }

}

export default StartPage;