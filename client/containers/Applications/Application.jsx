import React, { Component, PropTypes } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { applicationActions, connectionActions } from '../../actions';
import './Application.css';
import { ApplicationHeader, ApplicationInfo, ApplicationForm } from '../../components/Applications';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    application: state.application.get('record'),
    clients: state.clients.get('records').toJS(),
    connections: state.connections.get('records').toJS(),
    error: state.application.get('error')||state.clients.get('error'),
    loading: state.application.get('loading')||state.clients.get('loading')
  })

  static actionsToProps = {
    ...applicationActions,
    ...connectionActions
  }

  componentWillMount() {
    this.props.fetchApplication(this.props.params.id);
    this.props.fetchClients();
    this.props.fetchConnections();
  }

  render() {
    const { application, loading, error, clients, connections } = this.props;
    return (
      <div className="user">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Application Details</h2>
            <div className="pull-right">
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ApplicationHeader loading={loading} application={application} error={error} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs id="sso-app-tabs" defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Settings">
                <ApplicationForm appId={this.props.params.id} deleteApplication={this.props.deleteApplication} updateApplication={this.props.updateApplication} loading={loading} application={application} error={error} clients={clients} connections={connections} />
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
