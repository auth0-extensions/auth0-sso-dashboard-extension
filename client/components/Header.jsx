import './Header.css';
import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Header extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    issuer: React.PropTypes.string,
    isAdmin: React.PropTypes.bool,
    onLogout: React.PropTypes.func.isRequired
  }

  getPicture(iss, user) {
    if (user && user.get('picture')) {
      return user.get('picture');
    }

    if (user && user.get('nickname')) {
      return `https://cdn.auth0.com/avatars/${user.get('nickname').slice(0, 2).toLowerCase()}.png`;
    }

    return `https://cdn.auth0.com/avatars/${iss.slice(0, 2).toLowerCase()}.png`;
  }

  render() {
    const { user, issuer, onLogout, isAdmin } = this.props;
    const allowAuthz = window.config.ALLOW_AUTHZ;
    return (
      <header className="dashboard-header">
        <nav role="navigation" className="navbar navbar-default">
          <div className="container">
            <div id="header" className="navbar-header" style={{ width: '700px' }}>
              <a className="navbar-brand" href="#">{window.config.TITLE}</a>
            </div>
            <div id="navbar-collapse" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                    <img src={this.getPicture(issuer, user)} className="picture avatar" />
                    <span className="username-text">
                      { issuer }
                    </span>
                    <i className="icon-budicon-460" />
                  </span>
                  <ul role="menu" className="dropdown-menu">
                    <li role="presentation">
                      <Link role="menuitem" tabIndex="0" to="/applications">
                        Applications
                      </Link>
                    </li>
                    { isAdmin ?
                      <li role="presentation">
                        <Link role="menuitem" tabIndex="0" to="/applications/settings">
                          Settings
                        </Link>
                      </li>
                     : ''}
                    { isAdmin && allowAuthz ?
                      <li role="presentation">
                        <Link role="menuitem" tabIndex="0" to="/authorization">
                          Authorization
                        </Link>
                      </li>
                      : ''}
                    <li role="presentation">
                      <a href="#" role="menuitem" tabIndex="-1" onClick={onLogout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
