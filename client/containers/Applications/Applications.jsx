import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/application';
import { ApplicationOverview } from '../../components/Applications';

import './Applications.css';

class Applications extends Component {

  componentWillMount = () => {
    this.props.fetchApplications();
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
    const { loading, error, apps, total } = this.props;

    return (
      <div className="users">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2>Applications</h2>
          </div>
        </div>
        <ApplicationOverview onReset={this.onReset.bind(this)} onChangeSearch={this.onChangeSearch.bind(this)}
          error={error} applications={apps} total={total} loading={loading} deleteApplication={this.props.deleteApplication}
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
    apps: state.applications.get('records').toJS(),
    total: state.applications.get('total'),
    nextPage: state.applications.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(Applications);
