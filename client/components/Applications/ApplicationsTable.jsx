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

export default class ApplicationsTable extends Component {
  static propTypes = {
    applications: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired,
    deleteApplication: React.PropTypes.func.isRequired,
    updateApplication: React.PropTypes.func.isRequired,
    fetchApplications: React.PropTypes.func.isRequired,
    requestDeleteApplication: React.PropTypes.func.isRequired,
    cancelDeleteApplication: React.PropTypes.func.isRequired,
    showModalDelete: React.PropTypes.bool.isRequired,
    appId: React.PropTypes.string
  }

  enableDisableApp = (key, app, enabled) => {
    if (key && app) {
      if (enabled) {
        app.enabled = false;
      } else {
        app.enabled = true;
      }
      this.props.updateApplication(key, app, function () {
        this.props.fetchApplications();
      }.bind(this));
    }
  }

  render() {
    const { applications, renderActions, appId } = this.props;
    return (
      <div>
        <Confirm title="Remove Application" show={this.props.showModalDelete} loading={false}
                 onCancel={this.props.cancelDeleteApplication} onConfirm={(e) =>
        {
          this.props.deleteApplication(appId)
        }}>
          <span>
            Are you sure?
          </span>
        </Confirm>
        <Table>
          <TableBody>
            {Object.keys(applications).map((key) => {
              const application = applications[key];
              const logo = application.logo || 'https://cdn.auth0.com/manage/v0.3.1866/img/badge-grey.svg';
              const type = application.type;
              const callback = application.callback;
              const enabled = application.enabled;
              const appClassName = `btn btn-publish-app ${enabled ? 'btn-transparent' : 'btn-success'}`;
              const appButtonText = enabled ? "UNPUBLISH" : "PUBLISH";
              const name = application.name || application.client;
              const login_url = application.login_url;
              return (
                <TableRow key={key}>
                  <TableCell>
                    <div>
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
                    </div>
                  </TableCell>
                  <TableCell className="actions">
                    <ul className="list-inline list-inline-apps">
                      <div
                        className={appClassName}
                        onClick={() => this.enableDisableApp(key, application, enabled)}
                      >
                        {appButtonText}
                      </div>
                      <li title="Login" data-toggle="tooltip">
                        <a href={ login_url } target="_blank" key={ key }>
                          <i className="icon-budicon-187"></i>
                        </a>
                      </li>
                      <li title="Edit" data-toggle="tooltip">
                        <Link to={`/applications/${key}`}>
                          <i className="icon-budicon-329"></i>
                        </Link>
                      </li>
                      <li title="Remove" data-toggle="tooltip">
                        <a href="#" onClick={(e) => {
                          this.props.requestDeleteApplication(key);
                        } } className="remove-rule">
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
      </div>
    );
  }
}
