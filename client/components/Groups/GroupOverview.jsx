import React from 'react';
import { findDOMNode } from 'react-dom';

import GroupsTable from './GroupsTable';
import { Error, LoadingPanel } from '../Dashboard';
import { Link } from 'react-router';

export default class GroupOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onChangeSearch: React.PropTypes.func.isRequired,
    fetchGroups: React.PropTypes.func.isRequired,
    deleteGroup: React.PropTypes.func.isRequired,
    updateGroup: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    groups: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired,
    groupId: React.PropTypes.string
  }

  render() {
    const { loading, error, groups } = this.props;

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <GroupsTable
                loading={loading}
                groups={groups}
                deleteGroup={this.props.deleteGroup}
                fetchGroups={this.props.fetchGroups}
                updateGroup={this.props.updateGroup}
                groupId={this.props.groupId}
              />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
