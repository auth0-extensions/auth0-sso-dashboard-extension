import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/application';
import {ApplicationOverview, CreateApplicationOverview} from '../../components/Applications';
import './Applications.css';

class Applications extends Component {

    constructor(props) {
        super(props);
        this.state = { apps: [] }
    }

    static actionsToProps = {
        ...actions
    }

    componentWillMount = () => {
        this.props.fetchApplicationsAll();
        this.props.fetchClients();
        this.props.fetchConnections();
    }

    onChangeSearch = (query) => {
        if (query) {
            let apps = _.filter(this.props.applications, (app) => app.name.toLowerCase().indexOf(query) > -1);
            this.setState({apps: apps});
        } else {
            this.onReset();
        }
    }

    onReset = () => {
        this.setState({apps: []});
        this.props.fetchApplicationsAll();
    }

    openForm = () => {
        this.props.requestCreateApplication();
    }

    render() {
        const {loading, error, clients, applications, showModalCreate, showModalDelete, appId} = this.props;
        const apps = this.state.apps.length != 0 ? this.state.apps : applications;

        return (
            <div className="users">
                <div className="row content-header">
                    <div className="col-xs-12">
                        <h2>Applications</h2>
                    </div>
                </div>
                <div className="createAppButton">
                    <button className="btn btn-success" onClick={this.openForm}>
                        + Create App
                    </button>
                </div>
                <ApplicationOverview onReset={this.onReset.bind(this)}
                                     onChangeSearch={this.onChangeSearch.bind(this)}
                                     error={error}
                                     applications={apps}
                                     loading={loading}
                                     deleteApplication={this.props.deleteApplication}
                                     updateApplication={this.props.updateApplication}
                                     requestDeleteApplication={this.props.requestDeleteApplication}
                                     cancelDeleteApplication={this.props.cancelDeleteApplication}
                                     fetchApplications={this.props.fetchApplicationsAll}
                                     showModalDelete={showModalDelete}
                                     appId={appId}

                />
                <CreateApplicationOverview error={error}
                                           loading={loading}
                                           clients={clients}
                                           connections={this.props.connections}
                                           createApplication={this.props.createApplication}
                                           fetchApplications={this.props.fetchApplicationsAll}
                                           requestCreateApplication={this.props.requestCreateApplication}
                                           cancelCreateApplication={this.props.cancelCreateApplication}
                                           showModal={showModalCreate}
                                           currentClient={this.props.currentClient}
                                           currentType={this.props.currentType}
                                           onClientChange={this.props.onClientChange}
                                           onTypeChange={this.props.onTypeChange}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        error: state.applications.get('error'),
        loading: state.applications.get('loading'),
        applications: state.applications.get('records').toJS(),
        clients: state.clients.get('records').toJS(),
        connections: state.connections.get('records').toJS(),
        showModalCreate: state.createApplication.get('requesting'),
        showModalDelete: state.deleteApplication.get('requesting'),
        appId: state.deleteApplication.get('appId'),
        currentClient: state.application.get('currentClient'),
        currentType: state.application.get('currentType')
    };
}

export default connect(mapStateToProps, actions)(Applications);
