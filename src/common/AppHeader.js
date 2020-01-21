import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import './AppHeader.css';
import {Button, Layout} from 'antd';
const Header = Layout.Header;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

    //回看跳转
    videoJquery() {
        window.location.href = process.env.PUBLIC_URL + 'H5.html'
    }
  render() {
    return (
      <Header className="app-header">
          <span className="app-title" >
            <a href="#">视频预览</a>
                                <Button className="backSeeBtn" type="primary"
                                        onClick={this.videoJquery.bind(this)}>视频回看</Button>
          </span>
      </Header>
    );
  }
}



export default withRouter(AppHeader);
