import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { Home } from './Home'
import Login from './Login'
import Dashboard from './Dashboard'

// utils
import Storage from './utils/Storage'
import Service from './utils/Service'

class App extends Component {
  state={
    loggedIn: false,
  }

  componentDidMount() {
    console.log('lifecycle Mount App.js')
    const token = Storage.getToken()
    if (token) {
      Service.get('/api/user')
        .then(({ data }) => {
          // found user
          if (data.success) {
            this.setState({ loggedIn: true })
          }
        })
        .catch(err => console.log('Not authorized'))
    }
  }

  login = ({ data }) => {
    if (data.success) {
      Storage.setToken(data.token)
      this.setState({ loggedIn: true })
      this.props.history.push('/')
    }
  }

  logout = () => {
    Storage.setToken('')
    this.setState({ loggedIn: false })
    this.props.history.push('/')
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">User Authentication 101</h1>
        </header>
        <div className="navbar">
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to="/login">Login/Register</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <span className="fake-link" onClick={this.logout}>Logout</span>
            </li>
          </ul>
        </div>
        <div className="container">
            <Route exact path='/' render={() => <Home loggedIn={this.state.loggedIn}/>} />
            <Route path='/login' render={() => <Login login={this.login}/>} />
            <Route path='/dashboard' render={() => <Dashboard history={this.props.history} loggedIn={this.state.loggedIn}/>}/>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
