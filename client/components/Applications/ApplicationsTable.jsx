import React, {Component} from 'react';

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
import {Link} from 'react-router';

export default class ApplicationsTable extends Component {
    static propTypes = {
        applications: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        loading: React.PropTypes.bool.isRequired,
        deleteApplication: React.PropTypes.func.isRequired,
        updateApplication: React.PropTypes.func.isRequired,
        fetchApplications: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            appToDelete: null
        }
    }

    onCancel = () => {
        this.setState({
            showModal: false,
            appToDelete: null
        });
    }

    onConfirm = () => {
        let key = this.state.appToDelete;
        if (key) {
            this.props.deleteApplication(key, function () {
                this.setState({
                    showModal: false,
                    appToDelete: null
                });
            }.bind(this));
        } else {
            this.setState({
                showModal: false,
                appToDelete: null
            });
        }
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
        const {applications, renderActions} = this.props;
        return (
            <div>
                <Confirm title="Remove Application" show={this.state.showModal} loading={false}
                         onCancel={this.onCancel.bind(this)} onConfirm={this.onConfirm.bind(this)}>
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
                            const appClassName = enabled ? "publishedApp publishButtonApp" : "unpublishedApp publishButtonApp";
                            const appButtonText = enabled ? "UNPUBLISH >" : "PUBLISH >";
                            const name = application.name || application.client;
                            const login_url = application.login_url;
                            return (
                                <TableRow key={key}>
                                    <TableCell>
                                        <div>
                                            <div className="logoBlockImage">
                                                <img className="img-circle" src={ logo } alt={ name }/>
                                            </div>
                                            <div className="logoBlockInfo">
                                                <Link to={`/applications/${key}`}>
                                                    {name}
                                                </Link>
                                                <br />
                                                {type}
                                            </div>
                                            <div className={appClassName} onClick={function () {
                                                this.enableDisableApp(key, application, enabled);
                                            }.bind(this)}> {appButtonText}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="actions">
                                        <ul className="list-inline list-inline-apps">
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
                                                <a href="#" onClick={ function (e) {
                                                    e.preventDefault();
                                                    this.setState({
                                                        showModal: true,
                                                        appToDelete: key
                                                    });
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
            </div>
        );
    }
}
