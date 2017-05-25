import React, { Component } from 'react';

import {
  Confirm,
  TableActionCell,
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';
import { Link } from 'react-router';
import './GroupsTable.css';

export default class GroupsTable extends Component {
  static propTypes = {
    groups: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired,
    deleteGroup: React.PropTypes.func.isRequired,
    updateGroup: React.PropTypes.func.isRequired,
    fetchGroup: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string
  }

  constructor(props) {
    super(props);
      
    this.state = {
      showModalDelete: false,
      deletableGroupId: ""
    };
  }

  groupDeletionSuccess() {
    this.setState({
      showModalDelete: false,
      deletableGroupId: ""
    });
  }

  render() {
    const { groups } = this.props;

    if (Object.keys(groups).length === 0) {
      return (
        <div className="no-groups">
          <h2>There are no groups</h2>
          <h4>Go ahead and create one clicking the "Create group" button.</h4>
        </div>
      )
    }

    return (
      <div>
        <Confirm
          title="Remove Group" show={this.state.showModalDelete} loading={false}
          onCancel={() => this.setState({ showModalDelete: false })} onConfirm={() => {
            this.props.deleteGroup(this.state.deletableGroupId, () => this.groupDeletionSuccess());
          }}
        >
          <span>
            Do you really want to remove this group? Doing so <strong>will not</strong> delete the associated apps.
          </span>
        </Confirm>
        <Table>
          <TableBody>
            {Object.keys(groups).map((key) => {
              const group = groups[key];
              const { name, apps } = group;
              const appCount = apps.length;
              return (
                <TableRow key={key}>
                  <TableCell>
                    <div>
                      <div className="logoBlockInfo">
                        <Link to={`/groups/${key}`}>
                          <span className="application-name">{name}</span>
                        </Link>
                        <span className="group-app-count">{appCount ? appCount : 'No'} app{appCount === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="actions">
                    <ul className="list-inline list-inline-apps">
                      <li title="Edit" data-toggle="tooltip">
                        <Link to={`/groups/${key}`}>
                          <i className="icon-budicon-329" />
                        </Link>
                      </li>
                      <li title="Remove" data-toggle="tooltip">
                        <a
                          href="#" onClick={() => {
                            this.setState({ showModalDelete: true, deletableGroupId: key });
                          }} className="remove-rule"
                        >
                          <i className="icon-budicon-471" />
                        </a>
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
