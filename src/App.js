import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom"
import history from './history'
import './App.css';

import StartPage from './StartPage/StartPage';
import ChatPage from './ChatPage/ChatPage';
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch id="container">
          <Route exact path="/" component={StartPage} />
          <Route exact path="/chat" component={ChatPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
