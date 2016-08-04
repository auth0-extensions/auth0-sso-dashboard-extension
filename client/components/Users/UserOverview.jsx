import React from 'react';
import { findDOMNode } from 'react-dom';

import { SearchBar, UsersTable } from './';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';

export default class UserOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    users: React.PropTypes.array.isRequired,
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
    const { loading, error, users, total, renderActions } = this.props;

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
                <UsersTable loading={loading} users={users} renderActions={renderActions} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TableTotals currentCount={users.length} totalCount={total} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
