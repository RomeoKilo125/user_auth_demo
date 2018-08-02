import React from 'react'
import Service from './utils/Service'

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    passwordCheck: '',
    createAccount: true,
  }
  
  toggleLogin = () => this.setState({ createAccount: ! this.state.createAccount })
  
  updatePassword = (e) => this.setState({ password: e.target.value })
  
  updateEmail = (e) => this.setState({ email: e.target.value })
  
  updatePasswordCheck = (e) => this.setState({ passwordCheck: e.target.value })
  
  handleLogin = (e) => {
    e.preventDefault()
    
    Service.post('/api/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then(this.props.login)
      .catch(err => console.log(err))
  }
  
  handleRegistration = (e) => {
    e.preventDefault()
    const { email, password, passwordCheck } = this.state
    console.log('registration', this.state)
    if (email && password !== '' && password === passwordCheck) {
      Service.post('/api/register', {
        email: this.state.email,
        password: this.state.password,
      })
        .then(({ data }) => {
          if (data.success) {
            this.setState({ createAccount: false, email: '', password: '', passwordCheck: '' })
          }
        })
        .catch(err => console.log('Failed registration'))
    }
  }
  render() {
    const passwordsDoNotMatch = this.state.passwordCheck !== '' && this.state.passwordCheck !== this.state.password
    return (
      <form action="">

        <h4>{this.state.createAccount ? 'Register for an account' : 'Login To Existing Account'}</h4>

        {this.state.createAccount ? <h4>Already have an account? <span className='fake-link' onClick={this.toggleLogin}>Click Here to Login</span></h4> :
          <h4>Don't have an account? <span onClick={this.toggleLogin} className='fake-link'>Click Here to create one.</span></h4>}

        <div className="form-group">
          <div className='form-group-label'><label htmlFor="email">Email</label></div>
          <div className='form-group-input'>
            <input autoComplete='email' type="text" name="email" value={this.state.email} onChange={this.updateEmail}/>
          </div>
        </div>
        
        <div className="form-group">
          <div className='form-group-label'><label htmlFor="password">Password</label></div>
          <div className='form-group-input'>
            <input autoComplete='password' type="password" name="password" value={this.state.password} onChange={this.updatePassword}/>
          </div>
        </div>

        {this.state.createAccount && <div className="form-group">
          <div className='form-group-label'><label htmlFor="passwordConfirm">Confirm Password</label></div>
          <div className='form-group-input'>
            <input autoComplete='new-password' type="password" name="passwordConfirm" value={this.state.passwordCheck} onChange={this.updatePasswordCheck}/>
          </div>
        </div> }{passwordsDoNotMatch && <div>Your passwords don't match!</div>}

        {!this.state.createAccount ? (
        <button onClick={this.handleLogin}>Login</button> ) : (
        <button onClick={this.handleRegistration}>Register</button> )
        }

      </form>
    )
  }
}