import './Authorization.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Error, LoadingPanel } from '../components/Dashboard';
import { authorizationActions } from '../actions';
import './Applications/Applications.css';

class Authorization extends Component {
  static actionsToProps = {
    ...authorizationActions
  }

  constructor(props) {
    super(props);
    this.state = { apps: [] };
  }

  componentWillMount = () => {
    this.props.fetchAuthorizationStatus();
  }

  onEnable = () => {
    this.props.updateAuthorizationStatus(true);
  }

  onDisable = () => {
    this.props.updateAuthorizationStatus(false);
  }

  renderButton = () => {
    const authorizationStatus = (this.props.status === null) ? this.props.authorizationEnabled : this.props.status;

    if (authorizationStatus) {
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
        disabled={!this.props.authorizationApiAvailable}
      >
        Enable
      </div>
    )
  }

  renderHelpText = () => {
    if (this.props.authorizationApiAvailable) {
      return (
        <div>
          <p>
            You may setup authorization for SSO-Dashboard here.
          </p>
          <p>
            To enable authorization - just press button below.<br/>
            It will allow you to manage apps, using groups from your auth0-authz-extension.
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>
          You may setup authorization for SSO-Dashboard here.
        </p>
        <p>
          To enable authorization you need to install and configure auth0-authz-extension, enable authz-extension-api.<br/>
          It will allow you to manage apps, using groups from your auth0-authz-extension.
        </p>
      </div>
    );
  }

  render() {
    const { loading, error, authorization, status } = this.props;
    const authorizationStatus = (status === null) ? authorization : status;

    return (
      <LoadingPanel show={loading}>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
          </div>
        </div>

        <h2 className="title">
          Authorization 
          {!authorizationStatus && <span className="status">Disabled</span>}
        </h2> 
        <div className="authz">
          {this.renderHelpText()}
          {this.renderButton()}
        </div>
      </LoadingPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.updateAuthorization.get('error'),
    loading: state.updateAuthorization.get('loading'),
    status: state.updateAuthorization.get('status'),
    authorizationEnabled: state.authorization.get('authorizationEnabled'),
    authorizationApiAvailable: state.authorization.get('authorizationApiAvailable')
  };
}

export default connect(mapStateToProps, { ...authorizationActions })(Authorization);
