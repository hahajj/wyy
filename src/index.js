import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './app/App';
import Page from './app/Page';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <Page />
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
