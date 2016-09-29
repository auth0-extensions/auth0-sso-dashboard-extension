import React, {PropTypes, Component} from 'react';
import {Error, Json, LoadingPanel, InputCombo, InputText, Confirm} from '../Dashboard';
import _ from 'lodash';

export default class ApplicationForm extends Component {
    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        application: PropTypes.object.isRequired,
        updateApplication: PropTypes.func.isRequired,
        deleteApplication: PropTypes.func.isRequired,
        clients: React.PropTypes.array.isRequired,
        appId: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            currentClient: null,
            currentType: null,
            showModal: false
        }
    }

    getClientById = (id) => {
        return _.find(this.props.clients, function (client) {
            return client.client_id == id
        })
    }

    onClientChange = (e) => {
        if (e.target.value) {
            this.setState({currentClient: this.getClientById(e.target.value)});
        } else {
            this.setState({currentClient: null});
        }
    }

    getCallbacks = (app) => {
        if (this.state.currentClient) {
            return this.state.currentClient.callbacks ? (typeof this.state.currentClient.callbacks == 'string' ? [this.state.currentClient.callbacks] : this.state.currentClient.callbacks) : []
        } else {
            let client = this.getClientById(app.client);
            if (client) {
                return client.callbacks ? (typeof client.callbacks == 'string' ? [client.callbacks] : client.callbacks) : []
            } else {
                return [];
            }
        }
    }

    onChangeType = (e) => {
        if (e.target.value) {
            this.setState({currentType: e.target.value});
        } else {
            this.setState({currentType: null});
        }
    }

    getIsOpenId() {
        if (this.state.currentType) {
            return this.state.currentType == 'oidc';
        } else {
            if (this.props.application) {
                let app = this.props.application.toJS();
                return app.type == 'oidc';
            } else {
                return false;
            }
        }
    }

    onCancel = () => {
        this.setState({
            showModal: false
        });
    }

    onConfirm = () => {
        let app = this.props.appId;
        if (app) {
            this.props.deleteApplication(app, function () {
                this.setState({
                    showModal: false
                });
                history.back();
            }.bind(this));
        } else {
            this.setState({
                showModal: false
            });
        }
    }

    saveApplication = (e) => {
        e.preventDefault();
        let obj = {};
        obj['client'] = this.refs.client.value;
        obj['name'] = this.refs.name.value;
        obj['type'] = this.refs.type.value;
        if (this.refs.scope) {
            obj['scope'] = this.refs.scope.value;
        }
        if (this.refs.response_type) {
            obj['response_type'] = this.refs.response_type.value;
        }
        obj['logo'] = this.refs.logo.value;
        obj['callback'] = this.refs.callback.value;
        obj['connection'] = this.refs.connection.value;
        if (this.refs.enabled.checked) {
            obj['enabled'] = true;
        } else {
            obj['enabled'] = false;
        }
        this.props.updateApplication(this.props.appId, obj, function () {
            history.back();
        });
    }

    render() {
        if (this.props.loading || this.props.error) {
            return <div></div>;
        }
        const types = [{value: 'saml', text: 'SAML'}, {value: 'oidc', text: 'OpenID-Connect'}, {
            value: 'wsfed',
            text: 'WS-Federation'
        }];
        const clients = this.props.clients;
        const application = this.props.application.toJS();
        const callbacks = this.getCallbacks(application);
        const name = application.name || application.client;
        const clientId = application.client;
        const appLogo = application.logo;
        const appType = application.type;
        const appCallback = application.callback;
        const appEnabled = application.enabled;

        const appResType = application.response_type ? application.response_type : '';
        const appScope = application.scope ? application.scope : '';
        const appConnection = application.connection ? application.connection : '';
        const response_types = [{value: 'token', text: 'Single Page Application'}, {
            value: 'code',
            text: 'Traditional Web Application'
        }];
        const connections = this.props.connections;
        const isOpenId = this.getIsOpenId();

        return <div className="updateAppScreen">
            <Confirm title="Remove Application" show={this.state.showModal} loading={false}
                     onCancel={this.onCancel.bind(this)} onConfirm={this.onConfirm.bind(this)}>
            <span>
                Are you sure?
            </span>
            </Confirm>
            <form className="appForm updateAppForm" onSubmit={this.saveApplication}>
                <div className="form-group row">
                    <label htmlFor="app_client">Application</label>
                    <div className="col-xs-10">
                        <select ref="client" id="app_client" onChange={this.onClientChange.bind(this)} className="form-control"
                                name="client" required defaultValue={clientId}>
                            <option value="">Select...</option>
                            {clients.map((client, index) => {
                                return <option key={index}
                                               value={client.client_id}>{client.name || client.client_id}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="app_name">Name</label>
                    <div className="col-xs-10">
                        <input ref="name" placeholder="insert a name for users to see" name="name" id="app_name"
                               className="form-control" type="text" defaultValue={name} required/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="app_type">Type</label>
                    <div className="col-xs-10">
                        <select ref="type" id="app_type" className="form-control" name="type" required
                                onChange={this.onChangeType.bind(this)} defaultValue={appType}>
                            <option value="">Select...</option>
                            {types.map((type, index) => {
                                return <option key={index}
                                               value={type.value}>{type.text}</option>;
                            })}
                        </select>
                    </div>
                </div>
                {isOpenId ?
                    <div className="form-group row">
                        <label htmlFor="app_scope">Scope</label>
                        <div className="col-xs-10">
                            <input ref="scope" placeholder="Insert a scope" id="app_scope" name="scope" className="form-control"
                                   type="text" defaultValue={appScope}/>
                        </div>
                    </div>
                    : ''}
                {isOpenId ?
                    <div className="form-group row">
                        <label htmlFor="app_res_type">Response Type</label>
                        <div className="col-xs-10">
                            <select ref="response_type" id="app_res_type" className="form-control" name="response_type" required
                                    defaultValue={appResType}>
                                <option value="">Select...</option>
                                {response_types.map((r_type, index) => {
                                    return <option key={index}
                                                   value={r_type.value}>{r_type.text}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    : ''}
                <div className="form-group row">
                    <label htmlFor="app_logo_url">Icon Url</label>
                    <div className="col-xs-10">
                        <input ref="logo" placeholder="Insert an url of an image to use as a icon" id="app_logo_url" name="logo"
                               className="form-control" type="url" defaultValue={appLogo}/>
                        <div className="username-text app_tip">Tip: Choose the logo or image that represent the app
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="app_callback">Callback</label>
                    <div className="col-xs-10">
                        <select ref="callback" id="app_callback" className="form-control" name="callback" required
                                defaultValue={appCallback}>
                            <option value="">Select...</option>
                            {callbacks.map((callback, index) => {
                                return <option key={index}
                                               value={callback}>{callback}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="app_connection">Connection</label>
                    <div className="col-xs-10">
                        <select ref="connection" id="app_connection" className="form-control" name="connection"
                                defaultValue={appConnection}>
                            <option value="">Select...</option>
                            {connections.map((connection, index) => {
                                return <option key={index}
                                               value={connection.name}>{connection.name}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="zpp_enabled">Enabled?</label>
                    <div className="col-xs-10">
                        <input ref="enabled" id="app_enabled" name="enabled" type="checkbox" value={true}
                               defaultChecked={appEnabled}/>
                    </div>
                </div>
                <br />
                <div className="btn-div">
                    <button className="btn btn-info">Save Settings</button>
                </div>
                <br />
                <h5>Danger Zone</h5>
                <div className="red-border">
                    <p><strong>Warning!</strong> Once confirmed, this operation can't be undone!</p>
                    <p><input type="button" value="Delete Application" className="btn btn-danger delete-client "
                              onClick={function () {
                                  this.setState({
                                      showModal: true
                                  });
                              }.bind(this)}/></p>
                </div>
            </form>
        </div>
    }
}
