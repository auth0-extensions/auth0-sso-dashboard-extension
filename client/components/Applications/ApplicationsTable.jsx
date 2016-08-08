import React, { Component } from 'react';

import { TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

export default class ApplicationsTable extends Component {
  static propTypes = {
    applications: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    renderActions: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.applications !== this.props.applications;
  }

  render() {
    const { applications, renderActions } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="100%">Name</TableColumn>
        </TableHeader>
        <TableBody>
        {applications.map((application, index) => {
          return (
              <TableRow key={index}>
                <TableRouteCell route={`/applications/${application.client_id}`}>{ application.name || application.client_id }</TableRouteCell>
              </TableRow>
            );
        })}
        </TableBody>
      </Table>
    );
  }
}
