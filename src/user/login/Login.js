import React, {Component} from 'react';
import { login, getprom} from '../../util/APIUtils';
import './Login.css';
import {withRouter} from 'react-router-dom';
import {ACCESS_TOKEN} from '../../constants';

import {Form, Input, Button, Icon, notification} from 'antd';

const FormItem = Form.Item;

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
    }



    handleLogin() {
        notification.success({
            message: '通知',
            description: "You're successfully logged in.",
        });
        this.loadCurrentUser();

    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        // getCurrentUser()
        //     .then(response => {
        //         console.log(response)
        //         localStorage.setItem('currentUser', JSON.stringify(response));
        //         localStorage.setItem('isAuthenticated', true);
        //         localStorage.setItem('isLoading', false);
        //         this.props.history.push("/");
        //
        //     }).catch(error => {
        //     localStorage.setItem('isLoading', false);
        // });

    }

    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">

                <img className="loginLogo" src={process.env.PUBLIC_URL + '/favicon.png'}/>
                <h1 className="page-title">盛航安全监管</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.handleLogin}/>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        this.props.onLogin();
                    }).catch(error => {
                    if (error.status === 401) {
                        notification.error({
                            message: '通知',
                            description: 'Your Username or Password is incorrect. Please try again!'
                        });
                    } else {
                        notification.error({
                            message: '通知',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名!'}],
                    })(
                        <Input
                            className="loginInput"
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="username"
                            placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码!'}],
                    })(
                        <Input
                            className="loginInput"
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">登陆</Button>
                </FormItem>
            </Form>
        );
    }
}


export default withRouter(Login)
