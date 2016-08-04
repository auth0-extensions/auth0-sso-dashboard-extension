import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { applicationActions, connectionActions } from '../actions';

import Header from '../components/Header';
import { NavigationLink } from '../components/Dashboard';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    logout: PropTypes.func
  };

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchConnections();
  }

  render() {
    return (
      <div>
        <Header user={this.props.user} issuer={this.props.issuer} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div className="widget-title title-with-nav-bars">
                  <ul className="nav nav-tabs">
                    <NavigationLink title="Users" route="/users" />
                    <NavigationLink title="Logs" route="/logs" />
                  </ul>
                </div>
                <div id="content-area" className="tab-content">
                  { this.props.children }
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    issuer: state.auth.get('issuer'),
    user: state.auth.get('user'),
    ruleStatus: state.ruleStatus
  };
}

export default connect(select, { logout, ...applicationActions, ...connectionActions })(App);
