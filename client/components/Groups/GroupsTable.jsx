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
    requestDeleteGroup: React.PropTypes.func.isRequired,
    cancelDeleteGroup: React.PropTypes.func.isRequired,
    showModalDelete: React.PropTypes.bool.isRequired,
    groupId: React.PropTypes.string
  }

  render() {
    const { groups, groupId } = this.props;
    return (
      <div>
        <Confirm
          title="Remove Application" show={this.props.showModalDelete} loading={false}
          onCancel={this.props.cancelDeleteGroup} onConfirm={(e) => {
            this.props.deleteGroup(groupId);
          }}
        >
          <span>
            Do you really want to remove this group?
          </span>
        </Confirm>
        <Table>
          <TableBody>
            {Object.keys(groups).map((key) => {
              const group = groups[key];
              const name = group.name;
              return (
                <TableRow key={key}>
                  <TableCell>
                    <div>
                      <div className="logoBlockInfo">
                        <Link to={`/groups/${key}`}>
                          <span className="application-name">{name}</span>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="actions">
                    <ul className="list-inline list-inline-apps">
                      <li title="Edit" data-toggle="tooltip">
                        <Link to={`/applications/${key}`}>
                          <i className="icon-budicon-329" />
                        </Link>
                      </li>
                      <li title="Remove" data-toggle="tooltip">
                        <a
                          href="#" onClick={(e) => {
                            this.props.requestDeleteGroup(key);
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
