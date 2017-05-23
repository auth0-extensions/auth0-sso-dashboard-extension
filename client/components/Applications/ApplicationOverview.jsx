import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, ApplicationsTable } from './';
import { Error, LoadingPanel } from '../Dashboard';
import { Link } from 'react-router';

export default class ApplicationOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onChangeSearch: React.PropTypes.func.isRequired,
    fetchApplications: React.PropTypes.func.isRequired,
    deleteApplication: React.PropTypes.func.isRequired,
    updateApplication: React.PropTypes.func.isRequired,
    requestDeleteApplication: React.PropTypes.func.isRequired,
    cancelDeleteApplication: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    applications: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired,
    showModalDelete: React.PropTypes.bool.isRequired,
    appId: React.PropTypes.string
  }

  onChangeSearch = (e) => {
    this.props.onChangeSearch(findDOMNode(this.refs.search).value);
  }

  render() {
    const { loading, error, applications } = this.props;

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <SearchBar
            onReset={this.props.onReset} onChangeSearch={this.props.onChangeSearch}
            enabled={() => !loading}
          />
          <div className="row">
            <div className="col-xs-12">
              <ApplicationsTable
                loading={loading}
                applications={applications}
                deleteApplication={this.props.deleteApplication}
                fetchApplications={this.props.fetchApplications}
                updateApplication={this.props.updateApplication}
                requestDeleteApplication={this.props.requestDeleteApplication}
                cancelDeleteApplication={this.props.cancelDeleteApplication}
                showModalDelete={this.props.showModalDelete}
                appId={this.props.appId}
              />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
