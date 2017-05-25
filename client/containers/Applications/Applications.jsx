import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/application';
import { fetchGroups } from '../../actions/groups';
import { fetchAuthorizationStatus } from '../../actions/authorization';
import { ApplicationOverview, CreateApplicationDialog } from '../../components/Applications';
import CreateGroupDialog from '../../components/Groups/CreateGroupDialog';
import GroupOverview from '../../components/Groups/GroupOverview';
import './Applications.css';

class Applications extends Component {
  static actionsToProps = {
    ...actions,
    fetchGroups,
    fetchAuthorizationStatus
  }

  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      selectedTab: 1,
      showGroupCreateDialog: false
    };
  }

  componentWillMount = () => {
    this.props.fetchApplicationsAll();
    this.props.fetchGroupsAll();
    this.props.fetchClients();
    this.props.fetchConnections();
    this.props.fetchGroups();
    this.props.fetchAuthorizationStatus();
  }

  onChangeSearch = (query) => {
    if (query) {
      const apps = _.filter(this.props.applications, (app) => app.name.toLowerCase().indexOf(query) > -1);
      this.setState({ apps });
    } else {
      this.onReset();
    }
  }

  onReset = () => {
    this.setState({ apps: [] });
    this.props.fetchApplicationsAll();
    this.props.fetchGroupsAll();
  }

  openForm = () => {
    this.props.requestCreateApplication();
  }
  
  openGroupForm = () => {
    this.setState({ showGroupCreateDialog: true });
  }

  closeGroupForm = () => {
    this.setState({ showGroupCreateDialog: false });
  }

  render() {
    const { loading, error, clients, applications, showModalCreate, showModalDelete, appId, createError } = this.props;
    const apps = this.state.apps.length != 0 ? this.state.apps : applications;

    return (
      <div className="users user-tabs">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Settings</h2>
            {this.state.selectedTab === 1 &&
              <button
                className="btn btn-success btn-create-app"
                onClick={this.openForm}
              >
                + Create App
              </button>
            }
            
            {this.state.selectedTab === 2 &&
              <button
                className="btn btn-success btn-create-app"
                onClick={this.openGroupForm}
              >
                + Create Group
              </button>
            }
          </div>
        </div>
        <div className="page-description">Change the application or group settings.</div>
        <Tabs 
          id="sso-app-tabs"
          activeKey={this.state.selectedTab}
          animation={false}
          onSelect={(selectedTab) => this.setState({ selectedTab })}
        >
          <Tab eventKey={1} title="Applications">
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
          </Tab>
          <Tab eventKey={2} title="Groups">
            <GroupOverview
              onReset={this.onReset.bind(this)}
              onChangeSearch={this.onChangeSearch.bind(this)}
              error={error}
              groups={this.props.groups}
              loading={loading}
              deleteGroup={this.props.deleteGroup}
              updateGroup={this.props.updateGroup}
              fetchGroups={this.props.fetchGroupsAll}
            />
          </Tab>
        </Tabs>
        
        <CreateApplicationDialog
          error={error}
          createError={createError}
          loading={loading}
          clients={clients}
          groups={this.props.groups}
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

        <CreateGroupDialog
          error={error}
          createError={createError}
          loading={loading}
          groups={this.props.groups}
          createGroup={this.props.createGroup}
          showModal={this.state.showGroupCreateDialog}
          onComplete={this.closeGroupForm}
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
    groups: state.groups.get('records').toJS(),
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
