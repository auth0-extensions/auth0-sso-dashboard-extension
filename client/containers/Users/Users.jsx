import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/user';

import { UserOverview } from '../../components/Users';

import './Users.css';

class Users extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
  }

  onSearch = (query) => {
    this.props.fetchUsers(query);
  }

  onReset = () => {
    this.props.fetchUsers('', true);
  }

  render() {
    const { loading, error, users, total } = this.props;
console.log('render:', loading);
    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Users</h2>
          </div>
        </div>
        <UserOverview onReset={this.onReset} onSearch={this.onSearch}
          error={error} users={users} total={total} loading={loading}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.users.get('error'),
    loading: state.users.get('loading'),
    users: state.users.get('records').toJS(),
    total: state.users.get('total'),
    nextPage: state.users.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(Users);
