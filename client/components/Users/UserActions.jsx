import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class UserActions extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    databaseConnections: PropTypes.object.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    removeMfa: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired
  }

  state = {
    user: null,
    loading: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const { record, loading } = nextProps.user.toJS();
      this.setState({
        user: record,
        loading
      });
    }

    if (nextProps.databaseConnections) {
      this.setState({
        databaseConnections: nextProps.databaseConnections.toJS()
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.databaseConnections !== this.props.databaseConnections;
  }

  getDeleteAction = (user, loading) => (
    <MenuItem disabled={loading || false} onClick={this.deleteUser}>
      Delete User
    </MenuItem>
  );

  getResetPasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.resetPassword}>
        Reset Password
      </MenuItem>
    );
  };

  getChangePasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.changePassword}>
        Change Password
      </MenuItem>
    );
  };

  getMultifactorAction = (user, loading) => {
    if (!user.multifactor || !user.multifactor.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.removeMfa}>
        Remove MFA ({user.multifactor[0]})
      </MenuItem>
    );
  }

  getBlockedAction = (user, loading) => {
    if (user.blocked) {
      return (
        <MenuItem disabled={loading || false} onClick={this.unblockUser}>
          Unblock User
        </MenuItem>
      );
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.blockUser}>
        Block User
      </MenuItem>
    );
  }

  deleteUser = () => {
    this.props.deleteUser(this.state.user);
  }

  resetPassword = () => {
    this.props.resetPassword(this.state.user, this.state.databaseConnections[0]);
  }

  changePassword = () => {
    this.props.changePassword(this.state.user, this.state.databaseConnections[0]);
  }

  blockUser = () => {
    this.props.blockUser(this.state.user);
  }

  unblockUser = () => {
    this.props.unblockUser(this.state.user);
  }

  removeMfa = () => {
    this.props.removeMfa(this.state.user, this.state.user.multifactor[0]);
  }

  render() {
    if (!this.state.user) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="user-actions">
        {this.getMultifactorAction(this.state.user, this.state.loading)}
        {this.getBlockedAction(this.state.user, this.state.loading)}
        {this.getResetPasswordAction(this.state.user, this.state.loading)}
        {this.getChangePasswordAction(this.state.user, this.state.loading)}
        {this.getDeleteAction(this.state.user, this.state.loading)}
      </DropdownButton>
    );
  }
}
