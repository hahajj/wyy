import React, {Component} from 'react';
import './App.css';
import {
    Route,
    Switch
} from 'react-router-dom';

import {ACCESS_TOKEN} from '../constants';

import PollList from '../poll/PollList';
import AppHeader from '../common/AppHeader';

import {Layout, notification} from 'antd';
import NotFound from "../common/NotFound";

const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        }
        this.handleLogout = this.handleLogout.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }


    componentDidMount() {
        this.setState({
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            isAuthenticated: localStorage.getItem('isAuthenticated'),
        });
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isLoading');
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push('/login');

        notification[notificationType]({
            message: '通知',
            description: description,
        });
    }


    render() {
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/app"
                                   render={(props) => <PollList isAuthenticated={this.state.isAuthenticated}
                                                                currentUser={this.state.currentUser}
                                                                handleLogout={this.handleLogout} {...props}
                                   />}>
                            </Route>
                            <Route component={NotFound}></Route>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default App;
