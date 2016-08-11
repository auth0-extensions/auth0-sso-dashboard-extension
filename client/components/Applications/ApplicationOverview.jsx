import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, ApplicationsTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';
import { Link } from 'react-router';

export default class ApplicationOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onChangeSearch: React.PropTypes.func.isRequired,
    deleteApplication: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    applications: React.PropTypes.array.isRequired,
    clients: React.PropTypes.array.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  onChangeSearch = (e) => {
      this.props.onChangeSearch(findDOMNode(this.refs.search).value);
  }

  render() {
    const { loading, error, applications, total } = this.props;

    return (
      <div>
        <div className="createAppButton">
        <Link to="/applications/create">
          <button className="btn btn-success">
              + Create App
          </button>
        </Link>
        </div>
        <LoadingPanel show={ loading }>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error } />
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onChangeSearch={this.props.onChangeSearch} enabled={ () => !loading } />
          <div className="row">
            <div className="col-xs-12">
                <ApplicationsTable loading={loading} applications={applications} deleteApplication={this.props.deleteApplication} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TableTotals currentCount={applications.length} totalCount={total} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
