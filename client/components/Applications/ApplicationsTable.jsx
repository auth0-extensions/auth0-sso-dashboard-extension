import React, { Component } from 'react';

import { TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';
import { Link } from 'react-router';

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
            <TableColumn width="50%">Logo</TableColumn>
            <TableColumn width="30%">ID</TableColumn>
            <TableColumn width="20">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {applications.map((application, index) => {
              const logo = (application.client_metadata) ? application.client_metadata['sso-dashboard-logo'] : 'https://rawgit.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/fabrikam.svg';
              const type = (application.client_metadata) ? application.client_metadata['sso-dashboard-type'] : 'None';
              const callback = (application.client_metadata) ? application.client_metadata['sso-dashboard-callback'] : 'None';
              const enabled = (application.client_metadata && application.client_metadata['sso-dashboard-enabled'] == '1') ? 'Enabled' : 'Disabled';
              const name = application.name || application.client_id;
              return (
                  <TableRow key={index}>
                    <TableCell>
                        <div className="logoBlockImage">
                        <img className="img-circle" src={ logo } alt={ name } />
                        </div>
                        <div className="logoBlockInfo">
                        <Link to={`/applications/${application.client_id}`}>
                            {name}
                        </Link>
                            <br />
                        {type}
                        </div>
                    </TableCell>
                    <TableCell>{application.client_id}</TableCell>
                    <TableCell className="actions">
                        <ul className="list-inline">
                            <li title="" data-toggle="tooltip" data-original-title="Quickstart">
                                <a className="action-tutorial" href="#/applications/MqEQlRekHCYC4UTK8Xv9IVqFJrJE9Muq/quickstart">
                                    <i className="icon-budicon-359"></i>
                                </a>
                            </li>
                        </ul>
                    </TableCell>
                  </TableRow>
              );
            })}
          </TableBody>
        </Table>
    );
  }
}
