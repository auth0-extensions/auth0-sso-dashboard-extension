import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { Error, Confirm } from '../../components/Dashboard';
import getAppsForConnection from '../../selectors/getAppsForConnection';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    passwordReset: state.passwordReset,
    appsForConnection: getAppsForConnection(state, state.passwordReset.get('connection'))
  });

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    passwordReset: PropTypes.object.isRequired,
    appsForConnection: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.passwordReset !== this.props.passwordReset || nextProps.appsForConnection !== this.props.appsForConnection;
  }

  onConfirm = () => {
    this.props.onConfirm(this.refs.application.value);
  }

  render() {
    const { onCancel } = this.props;
    const { connection, userEmail, userName, error, requesting, loading } = this.props.passwordReset.toJS();

    if (!requesting) {
      return null;
    }

    return (
      <Confirm title="Reset Password?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to reset the password for <strong>{userName}</strong>?
          This will send an email to the user allowing them to choose a new password.
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label className="col-xs-2 control-label">Email</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={userEmail} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-2 control-label">Connection</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={connection} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-2 control-label">Application</label>
              <div className="col-xs-9">
                <select className="form-control" ref="application">
                  {this.props.appsForConnection.toJS().map((option, index) => <option key={index} value={option.client_id}>{option.name}</option>)}
                </select>
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});
