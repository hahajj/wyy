import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../user/login/Login';
import App from './App';
import NotFound from "../common/NotFound";
// console.log(App)
export default () => (

    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app" push />} />
            <Route path="/app" component={App} />
            <Route path="/login" component={ Login}></Route>
            <Route component={NotFound}></Route>
        </Switch>
    </Router>
);
