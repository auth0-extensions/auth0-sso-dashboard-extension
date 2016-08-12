import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/application';
import { ApplicationOverview, CreateApplicationOverview } from '../../components/Applications';
import './Applications.css';

class Applications extends Component {

  constructor(props) {
    super(props);
    this.state = {showModal: false}
  }
  static actionsToProps = {
    ...actions
  }

  componentWillMount = () => {
    this.props.fetchApplicationsAll();
    this.props.fetchClients();
    this.props.fetchConnections();
  }

  onChangeSearch = (query) => {
    if(query) {
      let apps = _.filter(this.props.applications, (app) =>  app.name.toLowerCase().indexOf(query) > -1);
      this.props.apps = apps;
      this.setState({apps:apps});
    } else {
      this.onReset();
    }
  }

  onReset = () => {
    $('.search-input-apps').val('');
    this.props.fetchApplications();
  }

  onClose = () => {
    this.setState({showModal: false})
  }

  openForm = () => {
    this.setState({showModal: true})
  }

  render() {
    const { loading, error, apps, clients } = this.props;
    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Applications</h2>
          </div>
        </div>
        <div className="createAppButton">
          <button className="btn btn-success" onClick={this.openForm}>
            + Create App
          </button>
        </div>
        <ApplicationOverview onReset={this.onReset.bind(this)} onChangeSearch={this.onChangeSearch.bind(this)}
          error={error} applications={apps} total={apps.length} loading={loading} deleteApplication={this.props.deleteApplication}
        />
        <CreateApplicationOverview showModal={this.state.showModal}
                           error={error}
                           onClose={this.onClose}
                           loading={loading}
                           clients={clients}
                           createApplication={this.props.createApplication}
                           fetchApplications={this.props.fetchApplicationsAll}
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
    clients: state.clients.get('records').toJS(),
    connections: state.connections.get('records').toJS(),
    apps: state.applications.get('records').toJS()
  };
}

export default connect(mapStateToProps, actions)(Applications);
