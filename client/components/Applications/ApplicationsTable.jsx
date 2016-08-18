import React, { Component } from 'react';

import { Confirm, TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';
import { Link } from 'react-router';

export default class ApplicationsTable extends Component {
  static propTypes = {
    applications: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired
  }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            appToDelete:null
        }
    }

  onCancel = () => {
      this.setState({
          showModal: false,
          appToDelete:null
      });
  }

    onConfirm = () => {
        let key = this.state.appToDelete;
        if(key) {
            this.props.deleteApplication(key,function(){
                this.setState({
                    showModal: false,
                    appToDelete:null
                });
            }.bind(this));
        } else {
            this.setState({
                showModal: false,
                appToDelete:null
            });
        }
    }


  render() {
    const { applications, renderActions } = this.props;
    return (
        <div>
        <Confirm title="Remove Application" show={this.state.showModal} loading={false} onCancel={this.onCancel.bind(this)} onConfirm={this.onConfirm.bind(this)}>
            <span>
                Are you sure?
            </span>
        </Confirm>
        <Table>
          <TableHeader>
            <TableColumn width="50%">Logo</TableColumn>
            <TableColumn width="30%">ID</TableColumn>
            <TableColumn width="20%">Actions</TableColumn>
          </TableHeader>
          <TableBody>
              {Object.keys(applications).map((key) => {
                const application = applications[key];
                const logo = application.logo || 'https://cdn.auth0.com/manage/v0.3.1866/img/badge-grey.svg';
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
                                    this.setState({
                                        showModal: true,
                                        appToDelete:key
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
