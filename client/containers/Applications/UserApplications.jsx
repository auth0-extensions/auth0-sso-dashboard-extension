import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/application';

import { UserApplicationOverview } from '../../components/Applications';

import './Applications.css';

class UserApplications extends Component {

  componentWillMount = () => {
    this.props.fetchApplications(true);
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

  render() {
    const { loading, error, apps } = this.props;
    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Applications</h2>
          </div>
        </div>
        <UserApplicationOverview onReset={this.onReset.bind(this)} onChangeSearch={this.onChangeSearch.bind(this)}
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
    applications: state.applications.get('records').toJS(),
    nextPage: state.applications.get('nextPage'),
    apps: state.applications.get('records').toJS()
  };
}

export default connect(mapStateToProps, actions)(UserApplications);
