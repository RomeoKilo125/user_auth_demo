import React from 'react'
import Service from './utils/Service'

class Dashboard extends React.Component {

  state={
    user: {}
  }

  componentDidMount() {
    Service.get('/api/user')
      .then(response => {
        // successful user info get
        if (response.data.success) {
          this.setState({ user: response.data.user })
        }
      })
      .catch(err => console.log('Not authorized'))
  }

  static getDerivedStateFromProps(props) {
    console.log('lifecycle dashboard')
    if (!props.loggedIn) {
      props.history.push('/')
    }
    return null
  }

  render() {
    const { user: { email } } = this.state
    return (
      <div className="dashboard">
        <div>Welcome to your dashboard!</div>
        <div>Your profile information</div>
        <div>Email Address: {email}</div>
      </div>
    )
  }
}

export default Dashboard;

