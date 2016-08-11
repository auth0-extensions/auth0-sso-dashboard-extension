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
              {Object.keys(applications).map((key) => {
                const application = applications[key];
                const logo = application.logo;
                const type = application.type;
                const callback = application.callback;
                const enabled = application.enabled;
                const name = application.name || application.client;
              return (
                  <TableRow key={key}>
                    <TableCell>
                        <div className="logoBlockImage">
                        <img className="img-circle" src={ logo } alt={ name } />
                        </div>
                        <div className="logoBlockInfo">
                        <Link to={`/applications/${key}`}>
                            {name}
                        </Link>
                            <br />
                        {type}
                        </div>
                    </TableCell>
                    <TableCell>{key}</TableCell>
                    <TableCell className="actions">
                        <ul className="list-inline">
                            <li title="Edit" data-toggle="tooltip">
                                <Link to={`/applications/${key}`}>
                                    <i className="icon-budicon-274"></i>
                                </Link>
                             </li>
                            <li title="Remove" data-toggle="tooltip">
                                <a href="#" onClick={ function(e){
                                    e.preventDefault();
                                    this.props.deleteApplication(key);
                                }.bind(this)} className="remove-rule">
                                    <i className="icon-budicon-471"></i>
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
