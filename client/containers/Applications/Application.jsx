import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Link } from 'react-router';
import { applicationActions, connectionActions, groupsActions, authorizationActions } from '../../actions';
import './Application.css';
import { ApplicationHeader, ApplicationInfo, ApplicationForm } from '../../components/Applications';
import { Confirm } from 'auth0-extension-ui';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    application: state.application.get('record'),
    clients: state.clients.get('records').toJS(),
    groups: state.groups.get('records'),
    authorization: state.authorization.get('authorizationEnabled'),
    connections: state.connections.get('records').toJS(),
    error: state.application.get('error') || state.clients.get('error'),
    updateError: state.updateApplication.get('error'),
    currentClient: state.application.get('currentClient'),
    currentType: state.application.get('currentType'),
    currentName: state.application.get('currentName'),
    loading: state.application.get('loading'),
    groups: state.groups.get('records').toJS(),
    showModalCreate: state.createApplication.get('requesting'),
    showModalDelete: state.deleteApplication.get('requesting')
  })

  static actionsToProps = {
    ...applicationActions,
    ...connectionActions,
    ...groupsActions,
    ...authorizationActions
  }

  componentWillMount() {
    this.props.fetchApplication(this.props.params.id);
    this.props.fetchClients();
    this.props.fetchConnections();
    this.props.fetchGroupsAll();
    this.props.fetchAuthorizationStatus();
  }

  updateCurrentApplication = (data) => {
    this.props.updateApplication(this.props.params.id, data);
  }

  clickRemoveButton = () => {
    this.props.requestDeleteApplication(this.props.params.id);
  }

  clickSubmitButton = () => {
    this.refs.app_form.submit();
  }

  render() {
    const { application, loading, error, clients, connections } = this.props;
    const applicationJSON = application.toJSON();
    const initialValues = {
      name: this.props.currentName || applicationJSON.name || applicationJSON.client,
      group: applicationJSON.group ? applicationJSON.group : '',
      client: this.props.currentClient,
      logo: applicationJSON.logo,
      type: this.props.currentType,
      callback: applicationJSON.callback,
      connection: applicationJSON.connection ? applicationJSON.connection : '',
      groups: applicationJSON.groups ? applicationJSON.groups : '',
      response_type: applicationJSON.response_type ? applicationJSON.response_type : '',
      scope: applicationJSON.scope ? applicationJSON.scope : '',
      customURLEnabled: applicationJSON.customURLEnabled || false,
      customURL: applicationJSON.customURL ? applicationJSON.customURL : '',
      enabled: applicationJSON.enabled
    };

    return (
      <div className="user">
        <Confirm
          title="Remove Application" show={this.props.showModalDelete} loading={false}
          onCancel={this.props.cancelDeleteApplication}
          onConfirm={(e) => {
            this.props.deleteApplication(this.props.params.id, () => {
              history.back();
            });
          }}
        >
          <span>
            Do you really want to remove this application?
          </span>
        </Confirm>

        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="settings-header">{application.get('name') || 'Application Settings'}</h2>
            <Link className="btn btn-transparent back-to-apps pull-right" to="/applications/settings">
              <span className="btn-icon icon-budicon-521" />
              Go back to Applications
            </Link>
          </div>
        </div>
        
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs id="sso-app-tabs" defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Settings">
                <ApplicationForm
                  ref="app_form"
                  onSubmit={this.updateCurrentApplication}
                  initialValues={initialValues}
                  onClientChange={this.props.onClientChange}
                  onTypeChange={this.props.onTypeChange}
                  onNameChange={this.props.onNameChange}
                  loading={loading}
                  application={applicationJSON}
                  groups={this.props.groups}
                  authorizationEnabled={this.props.authorization}
                  error={this.props.updateError}
                  clients={clients}
                  groups={this.props.groups}
                  currentClient={this.props.currentClient}
                  currentType={this.props.currentType}
                  currentName={this.props.currentName}
                  connections={connections}
                />
                <br />
                <div className="btn-div">
                  <button className="btn btn-info" onClick={this.clickSubmitButton}>Save Settings</button>
                </div>
                
                <div className="red-border">
                  <h5>Danger Zone</h5>
                  <p><strong>Warning!</strong> Once confirmed, this operation can't be undone!</p>
                  <p><input
                    onClick={this.clickRemoveButton} type="button" value="Delete Application"
                    className="btn btn-danger delete-client "
                  /></p>
                </div>
              </Tab>
              <Tab eventKey={2} title="Info">
                <ApplicationInfo loading={loading} application={application} error={error} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
});
