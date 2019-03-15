import './ApplicationTable.css';
import React, { Component } from 'react';

import {
  Confirm,
  Table,
  TableCell,
  TableBody,
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
    moveApplication: React.PropTypes.func.isRequired,
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
      this.props.updateApplication(key, app, () => {
        this.props.fetchApplications();
      });
    }
  }

  renderMoveButton(id, direction, row, total) {
    const icon = direction === 'up' ? 'icon-budicon-462' : 'icon-budicon-460';
    const enabled = (direction === 'up' && row > 1) || (direction === 'down' && row < total);
    return (
      <li title={direction} data-toggle="tooltip">
        <a
          href="#" onClick={(e) => {
            if (enabled) {
              this.props.moveApplication(id, direction);
            }
          }} className={`move-app ${!enabled ? 'disabled' : ''}`}
        >
          <i className={icon} />
        </a>
      </li>
    );
  }

  render() {
    const { applications, appId } = this.props;
    const rowsTotal = Object.keys(applications).length;
    let rowIndex = 0;
    return (
      <div>
        <Confirm
          title="Remove Application" show={this.props.showModalDelete} loading={false}
          onCancel={this.props.cancelDeleteApplication} onConfirm={(e) => {
            this.props.deleteApplication(appId);
          }}
        >
          <span>
            Do you really want to remove this application?
          </span>
        </Confirm>
        <Table>
          <TableBody>
            {Object.keys(applications).map((key) => {
              const application = applications[key];
              const applicationId = applications[key].id;
              const logo = application.logo || 'https://cdn.auth0.com/manage/v0.3.1866/img/badge-grey.svg';
              const type = application.type;
              const enabled = application.enabled;
              const appClassName = `btn btn-publish-app ${enabled ? 'btn-transparent' : 'btn-success'}`;
              const appButtonText = enabled ? 'UNPUBLISH' : 'PUBLISH';
              const name = application.name || application.client;
              const loginUrl = application.loginUrl;
              rowIndex++;
              return (
                <TableRow key={applicationId}>
                  <TableCell>
                    <div>
                      <div className="logoBlockImage">
                        <img src={logo} alt={name} />
                      </div>
                      <div className="logoBlockInfo">
                        <Link to={`/applications/${applicationId}`}>
                          <span className="application-name">{name}</span>
                        </Link>
                        <span className="application-type">{type}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="actions">
                    <ul className="list-inline list-inline-apps">
                      <div
                        className={appClassName}
                        onClick={() => this.enableDisableApp(applicationId, application, enabled)}
                      >
                        {appButtonText}
                      </div>
                      <li title="Login" data-toggle="tooltip">
                        <a href={loginUrl} target="_blank" key={applicationId}>
                          <i className="icon-budicon-187" />
                        </a>
                      </li>
                      {this.renderMoveButton(applicationId, 'up', rowIndex, rowsTotal)}
                      {this.renderMoveButton(applicationId, 'down', rowIndex, rowsTotal)}
                      <li title="Edit" data-toggle="tooltip">
                        <Link to={`/applications/${applicationId}`}>
                          <i className="icon-budicon-329" />
                        </Link>
                      </li>
                      <li title="Remove" data-toggle="tooltip">
                        <a
                          href="#" onClick={(e) => {
                            this.props.requestDeleteApplication(applicationId);
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
