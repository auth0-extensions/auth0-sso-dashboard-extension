import React from 'react';

import {ApplicationsList, SearchBar} from './';
import {Error, LoadingPanel, TableTotals} from '../Dashboard';

export default class UserApplicationOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onChangeSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    applications: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  render() {
    const {loading, error, applications, total} = this.props;

    return (
      <div>
        <div className="page-description">Select the application you want to log in to.</div>
        <LoadingPanel show={ loading }>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error }/>
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onChangeSearch={this.props.onChangeSearch}
            enabled={ () => !loading }/>
          <div className="row">
            <div className="col-xs-12">
              <ApplicationsList loading={loading} applications={applications}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
