import React, { Component } from "react";
import { Button } from 'antd';
import "antd/dist/antd.css";
import './StartPage.css';
import axios from 'axios';
import io from 'socket.io-client';

class StartPage extends Component {


     state = {
        username: "",
     };

     submit = (event) => {
        let that = this;
        axios.post(/*IP*/ + '/register', { name: this.state.username })
        .then(function (response) {
        console.log(response);
        // cookies.set('isAuthen', 'true', { path: '/', maxAge: 60 * 60 * 24 });
        // cookies.set('username', that.state.username, { path: '/', maxAge: 60 * 60 * 24 });
        // cookies.set('uid', response.data.uid, { path: '/', maxAge: 60 * 60 * 24 });
   //     window.location = '/main';
        })
        .catch(function (err) {
           console.error(err);
        });
    }
    render() {
        return (
            <div>
                START PAGE
            </div>
        )
    }

}

export default StartPage;