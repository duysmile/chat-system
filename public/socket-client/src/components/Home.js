import React from 'react';
import { Redirect } from 'react-router-dom';
import RequestHelper from '../helpers/request-helper';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            redirect: false,
            error: ''
        };
        
        this.login = this.login.bind(this);
        this.changeInputUsername = this.changeInputUsername.bind(this);
        this.changeInputPassword = this.changeInputPassword.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem('access_token');
        if (!!token) {
            this.setState({
                redirect: true
            });
        }
    }

    async login(event) {
        try {
            event.preventDefault();
            const username = this.state.username;
            const password = this.state.password;
            const resultLogin = await RequestHelper.post('/api/v1/login', {
                username,
                password
            });
            const data = resultLogin.data;
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('userId', data.data._id);
            return this.setState({
                redirect: true
            })
        } catch (err) {
            console.log(err.response.data);
        }
    }

    changeInputUsername(event) {
        this.setState({
            username: event.target.value
        })
    }

    changeInputPassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    render() {
        return (
            <div className="h-100 d-flex justify-content-center align-items-center">
                {this.state.redirect && (<Redirect to='/rooms'/>)}
                <form className="border p-5 w-25" id="form-login" onSubmit={this.login}>
                    <div className="mb-3 d-flex justify-content-center">
                        <h3 className="text-white">
                            CHAT APP
                        </h3>
                    </div>
                    
                    <div className="form-group">
                        <input 
                            value={this.state.username} 
                            onChange={this.changeInputUsername}
                            type="text" 
                            autoComplete="off" 
                            name="username" 
                            style={{background: 'transparent'}} 
                            className="text-white form-control rounded-0" 
                            placeholder="Username"/>
                    </div>
                    <div className="form-group">
                        <input
                            value={this.state.password} 
                            onChange={this.changeInputPassword}
                            type="password" 
                            name="password" 
                            style={{background: 'transparent'}} 
                            className="text-white form-control rounded-0" 
                            placeholder="Password"/>                    
                    </div>
                    <div className="form-group form-check mb-0">
                        <input type="checkbox" className="form-check-input" name="remeberMe"/>
                        <label className="form-check-label text-white" htmlFor="rememberMe">
                            Remember me        
                        </label>
                    </div>
                    
                    <div className="mb-2" style={{minHeight: '2em'}}>
                    {!!this.state.error && (
                        <small className="text-danger">{this.state.error}</small>
                    )}
                    </div>
                    
                    <div className="d-flex justify-content-center">
                        <input className="btn border text-white rounded-0 w-50" type="submit" value="Login"/>
                    </div>
                </form>
            </div>
        )
    }
};