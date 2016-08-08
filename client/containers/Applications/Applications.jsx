import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/application';

import { ApplicationOverview } from '../../components/Applications';

import './Applications.css';

class Applications extends Component {

  componentWillMount = () => {
    this.props.fetchApplications();
  }

  onSearch = (query) => {
    this.props.fetchApplications(query);
  }

  onReset = () => {
    this.props.fetchApplications('', true);
  }

  render() {
    const { loading, error, applications, total } = this.props;
    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Applications</h2>
          </div>
        </div>
        <ApplicationOverview onReset={this.onReset} onSearch={this.onSearch}
          error={error} applications={applications} total={total} loading={loading}
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
    total: state.applications.get('total'),
    nextPage: state.applications.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(Applications);
