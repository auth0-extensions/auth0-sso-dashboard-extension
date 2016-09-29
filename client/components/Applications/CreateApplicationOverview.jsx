import React, { Component, PropTypes } from 'react'
import { Error, Confirm } from '../Dashboard';

export default class CreateApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentClient: null,
      currentType: null
    }
  }

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    connections: PropTypes.array.isRequired,
    createApplication: PropTypes.func.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired,
    requestCreateApplication: React.PropTypes.func.isRequired,
    cancelCreateApplication: React.PropTypes.func.isRequired,
  }

  onConfirm = () => {
    this.createApplication();
  }

  onCancel = () => {
    return this.props.cancelCreateApplication();
  }

  getClientById = (id) => {
    return _.find(this.props.clients, function (client) {
      return client.client_id == id
    })
  }

  onClientChange = (e) => {
    if (e.target.value) {
      this.setState({ currentClient: this.getClientById(e.target.value) });
    } else {
      this.setState({ currentClient: null });
    }
  }

  getCallbacks = () => {
    if (this.state.currentClient) {
      return this.state.currentClient.callbacks ? (typeof this.state.currentClient.callbacks == 'string' ? [this.state.currentClient.callbacks] : this.state.currentClient.callbacks) : []
    } else {
      return [];
    }
  }

  onChangeType = (e) => {
    if (e.target.value) {
      this.setState({ currentType: e.target.value });
    } else {
      this.setState({ currentType: null });
    }
  }

  getIsOpenId = () => {
    return this.state.currentType === 'oidc';
  }

  createApplication = () => {

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
    return this.props.createApplication(obj);
  }

  render() {
    const { loading, clients, connections, error, showModal }  = this.props;

    if (loading || error) {
      return <div></div>;
    }
    const types = [{ value: 'saml', text: 'SAML' }, { value: 'oidc', text: 'OpenID-Connect' }, {
      value: 'wsfed',
      text: 'WS-Federation'
    }];
    const callbacks = this.getCallbacks();

    const response_types = [{ value: 'token', text: 'Single Page Application' }, {
      value: 'code',
      text: 'Traditional Web Application'
    }];

    const isOpenId = this.getIsOpenId();

    return (
      <div>
        <Confirm successClass="info"
                 show={showModal}
                 confirmMessage="Create"
                 cancelMessage="Cancel"
                 title="New Application"
                 loading={loading} onCancel={this.onCancel}
                 onConfirm={this.onConfirm}>
          <div className="user">
            <div className="spanTitle"><span className="username-text">Add new application</span></div>
            <div>
              <form className="appForm">
                <div className="form-group row">
                  <label htmlFor="app_client">Application</label>
                  <div className="col-xs-10">
                    <select id="app_client" onChange={this.onClientChange.bind(this)} className="form-control"
                            name="client" ref="client" required>
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
                    <input placeholder="insert a name for users to see" name="name" id="app_name"
                           className="form-control" ref="name" type="text" required />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="app_type">Type</label>
                  <div className="col-xs-10">
                    <select id="app_type" ref="type" className="form-control" name="type" required
                            onChange={this.onChangeType.bind(this)}>
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
                      <input placeholder="Insert a scope" id="app_scope" name="scope" ref="scope"
                             className="form-control"
                             type="text" />
                    </div>
                  </div>
                  : ''}
                {isOpenId ?
                  <div className="form-group row">
                    <label htmlFor="app_res_type">Response Type</label>
                    <div className="col-xs-10">
                      <select id="app_res_type" className="form-control" ref="response_type" name="response_type"
                              required>
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
                    <input placeholder="Insert an url of an image to use as a icon" id="app_logo_url" name="logo"
                           className="form-control" ref="logo" type="url" />
                    <div className="username-text app_tip">Tip: Choose the logo or image that represent the app
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="app_callback">Callback</label>
                  <div className="col-xs-10">
                    <select id="app_callback" className="form-control" name="callback" ref="callback" required>
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
                    <select id="app_connection" className="form-control" ref="connection" name="connection">
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
                    <input id="app_enabled" name="enabled" ref="enabled" type="checkbox" value={true} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Confirm>
      </div>
    );
  }
};
