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
          <TableColumn width="15%">Logo</TableColumn>
          <TableColumn width="50%">Name</TableColumn>
          <TableColumn width="20">SSO-Type</TableColumn>
          <TableColumn width="15">Status</TableColumn>
        </TableHeader>
        <TableBody>
        {applications.map((application, index) => {
            if(application.client_metadata) {
                return (
                    <TableRow key={index}>
                        <TableCell>
                            <img className="img-circle" src={ application.client_metadata['sso-dashboard-logo'] } alt={ application.name || application.client_id} width="32" />
                        </TableCell>
                        <TableRouteCell route={`/applications/${application.client_id}`}>{ application.name || application.client_id }</TableRouteCell>
                        <TableTextCell>{ application.client_metadata['sso-dashboard-type'] }</TableTextCell>
                        <TableTextCell>{ application.client_metadata['sso-dashboard-enabled']=='1'?'Yes':'No' }</TableTextCell>
                    </TableRow>
                );
            } else {
                return (
                    <TableRow key={index}>
                        <TableCell>
                            <img className="img-circle" src="https://rawgit.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/fabrikam.svg" alt={ application.name || application.client_id} width="32" />
                        </TableCell>
                        <TableRouteCell route={`/applications/${application.client_id}`}>{ application.name || application.client_id }</TableRouteCell>
                        <TableTextCell>None</TableTextCell>
                        <TableTextCell>None</TableTextCell>
                    </TableRow>
                );
            }

        })}
        </TableBody>
      </Table>
    );
  }
}
