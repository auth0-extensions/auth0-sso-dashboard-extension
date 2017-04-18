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
    this.props.fetchGroupedApps();
  }

  onChangeSearch = (query) => {
    if (query) {
      let apps = this.props.groupedApps.map((group) => {
        group.apps = group.apps.filter((app) => app.name.toLowerCase().indexOf(query) > -1);
        return group;
      })
    
      this.setState({ apps });
    } else {
      this.onReset();
    }
  }

  onReset = () => {
    this.setState({ apps: [] });
    this.props.fetchGroupedApps();
  }

  render() {
    const { loading, error, groupedApps } = this.props;
    const apps = this.state.apps.length != 0 ? this.state.apps : groupedApps;

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
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.applications.get('error'),
    loading: state.applications.get('loading'),
    groupedApps: state.groupedApps.get('records').toJS(),
    nextPage: state.applications.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(UserApplications);
