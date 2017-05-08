import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Error, LoadingPanel } from '../components/Dashboard';
import { authzActions } from '../actions';
import './Applications/Applications.css';

class AuthzIntegration extends Component {
  static actionsToProps = {
    ...authzActions
  }

  constructor(props) {
    super(props);
    this.state = { apps: [] };
  }

  componentWillMount = () => {
    this.props.fetchAuthzStatus();
  }

  onEnable = () => {
    this.props.updateAuthzStatus(true);
  }

  onDisable = () => {
    this.props.updateAuthzStatus(false);
  }

  renderButton = () => {
    const authzStatus = (this.props.status === null) ? this.props.authz : this.props.status;

    if (authzStatus) {
      return (
        <div
          className='btn btn-publish-app btn-transparent'
          onClick={this.onDisable}
        >
          Disable
        </div>
      )
    }

    return (
      <div
        className='btn btn-publish-app btn-success'
        onClick={this.onEnable}
      >
        Enable
      </div>
    )
  }

  render() {
    const { loading, error, authz, status } = this.props;
    const authzStatus = (status === null) ? authz : status;

    return (
      <LoadingPanel show={loading}>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
          </div>
        </div>
        <div className="authz">
          <h2>
            Authz integration is {(authzStatus) ? 'Enabled' : 'Disabled'}.
          </h2>
          <p>
            You may setup authz-extension integration here.
          </p>
          <p>
            To enable authz-itegration you need to install and configure auth0-authz-extension, enable authz-api.<br/>
            It will allow you to manage apps, using groups fron your authz-extension.
          </p>
          {this.renderButton()}
        </div>
      </LoadingPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.updateAuthz.get('error'),
    loading: state.updateAuthz.get('loading'),
    status: state.updateAuthz.get('status'),
    authz: state.authz.get('authzEnabled')
  };
}

export default connect(mapStateToProps, { ...authzActions })(AuthzIntegration);
