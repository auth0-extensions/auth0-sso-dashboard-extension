import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import * as actions from '../../actions/application';
import { fetchGroups } from '../../actions/groups';
import { fetchAuthorizationStatus } from '../../actions/authorization';
import { ApplicationOverview, CreateApplicationDialog } from '../../components/Applications';
import './Applications.css';

class Applications extends Component {
  static actionsToProps = {
    ...actions,
    fetchGroups,
    fetchAuthorizationStatus
  }

  constructor(props) {
    super(props);
    this.state = { apps: [] };
  }

  componentWillMount = () => {
    this.props.fetchApplicationsAll();
    this.props.fetchClients();
    this.props.fetchConnections();
    this.props.fetchGroups();
    this.props.fetchAuthorizationStatus();
  }

  onChangeSearch = (query) => {
    if (query) {
      const apps = filter(this.props.applications, (app) => app.name.toLowerCase().indexOf(query) > -1);
      this.setState({ apps });
    } else {
      this.onReset();
    }
  }

  onReset = () => {
    this.setState({ apps: [] });
    this.props.fetchApplicationsAll();
  }

  openForm = () => {
    this.props.requestCreateApplication();
  }

  render() {
    const { loading, error, clients, applications, showModalCreate, showModalDelete, appId, createError } = this.props;
    const apps = this.state.apps.length != 0 ? this.state.apps : applications;

    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Settings</h2>
            <button
              className="btn btn-success btn-create-app"
              onClick={this.openForm}
            >
              + Create App
            </button>
          </div>
        </div>
        <div className="page-description">Change the application settings.</div>
        <ApplicationOverview
          onReset={this.onReset.bind(this)}
          onChangeSearch={this.onChangeSearch.bind(this)}
          error={error}
          applications={apps}
          loading={loading}
          deleteApplication={this.props.deleteApplication}
          updateApplication={this.props.updateApplication}
          requestDeleteApplication={this.props.requestDeleteApplication}
          cancelDeleteApplication={this.props.cancelDeleteApplication}
          fetchApplications={this.props.fetchApplicationsAll}
          showModalDelete={showModalDelete}
          appId={appId}
        />
        <CreateApplicationDialog
          error={error}
          createError={createError}
          loading={loading}
          clients={clients}
          connections={this.props.connections}
          groups={this.props.groups}
          authorizationEnabled={this.props.authorization}
          createApplication={this.props.createApplication}
          fetchApplications={this.props.fetchApplicationsAll}
          requestCreateApplication={this.props.requestCreateApplication}
          cancelCreateApplication={this.props.cancelCreateApplication}
          showModal={showModalCreate}
          currentClient={this.props.currentClient}
          currentType={this.props.currentType}
          currentName={this.props.currentName}
          onClientChange={this.props.onClientChange}
          onTypeChange={this.props.onTypeChange}
          onNameChange={this.props.onNameChange}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.applications.get('error'),
    loading: state.applications.get('loading'),
    applications: state.applications.get('records').toJS(),
    authorization: state.authorization.get('authorizationEnabled'),
    groups: state.groups.get('records'),
    clients: state.clients.get('records').toJS(),
    connections: state.connections.get('records').toJS(),
    showModalCreate: state.createApplication.get('requesting'),
    showModalDelete: state.deleteApplication.get('requesting'),
    appId: state.deleteApplication.get('appId'),
    currentClient: state.application.get('currentClient'),
    createError: state.createApplication.get('error'),
    currentType: state.application.get('currentType'),
    currentName: state.application.get('currentName')
  };
}

export default connect(mapStateToProps, { ...actions, fetchGroups, fetchAuthorizationStatus })(Applications);
