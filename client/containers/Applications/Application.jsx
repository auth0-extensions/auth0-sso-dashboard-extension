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
        
      </div>
    );
  }
});
