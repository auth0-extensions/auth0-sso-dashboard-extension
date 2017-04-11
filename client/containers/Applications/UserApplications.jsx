import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/application';

import { UserApplicationOverview } from '../../components/Applications';

import './Applications.css';

class UserApplications extends Component {
  constructor(props) {
    super(props);
    this.state = { apps: [] };
  }

  componentWillMount = () => {
    this.props.fetchApplications(true);
    this.props.fetchGroups();
  }

  onChangeSearch = (query) => {
    if (query) {
    
      let apps = Object.keys(this.props.applications)
        .map((appId) => {
          const app = this.props.applications[appId];
          app.id = appId;
          return app;
        })
        .filter((app) => app.name.toLowerCase().indexOf(query) > -1);
      this.setState({ apps });
    } else {
      this.onReset();
    }
  }

  onReset = () => {
    this.setState({ apps: [] });
    this.props.fetchApplications();
    this.props.fetchGroups();
  }

  render() {
    const { loading, error, applications, groups } = this.props;
    const apps = this.state.apps.length != 0 ? this.state.apps : applications;

    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Applications</h2>
          </div>
        </div>
        <UserApplicationOverview
          onReset={this.onReset.bind(this)}
          onChangeSearch={this.onChangeSearch.bind(this)}
          error={error} applications={apps} loading={loading}
          groups={groups}
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
    groups: state.groups.get('records').toJS(),
    nextPage: state.applications.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(UserApplications);
