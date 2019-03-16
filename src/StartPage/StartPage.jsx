import React, { Component } from "react";
import { Button, Input } from 'antd';
import "antd/dist/antd.css";
import './StartPage.css';

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
        console.log(this.state.username)
    }

    handleLogIn = () => {
        // TODO: Log in and go to chat page
    }

    render() {
        return (
            <div className='background center-child'>
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