import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, ApplicationsTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';

export default class ApplicationOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    applications: React.PropTypes.array.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired,
    renderActions: React.PropTypes.func.isRequired
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  render() {
    const { loading, error, applications, total, renderActions } = this.props;

    return (
      <div>
        <LoadingPanel show={ loading }>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error } />
            </div>
          </div>
          <SearchBar onReset={this.props.onReset} onSearch={this.props.onSearch} enabled={!loading} />
          <div className="row">
            <div className="col-xs-12">
                <ApplicationsTable loading={loading} applications={applications} renderActions={renderActions} />
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
