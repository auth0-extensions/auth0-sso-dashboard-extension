import React from 'react';

import { ApplicationsList, SearchBar } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';

export default class UserApplicationOverview extends React.Component {
  static propTypes = {
    error: React.PropTypes.object,
    applications: React.PropTypes.array.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  render() {
    const { loading, error, applications, total } = this.props;

    return (
      <div>
        <div className="page-description">Select the application you want to log in to.</div>
        <LoadingPanel show={ loading }>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error } />
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onChangeSearch={this.props.onChangeSearch} enabled={ () => !loading } />
          <div className="row">
            <div className="col-xs-12">
                <ApplicationsList loading={loading} applications={applications} />
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
