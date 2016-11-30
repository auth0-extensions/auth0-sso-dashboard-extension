import React, { PropTypes, Component } from 'react';
import { InputCombo, InputText, InputCheckBox, Error } from 'auth0-extension-ui';
import { Field } from 'redux-form';
import _ from 'lodash';

import createForm from '../../utils/createForm';

export default createForm('application', class extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    clients: React.PropTypes.array.isRequired,
    connections: React.PropTypes.array.isRequired,
    onClientChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    currentClient: React.PropTypes.string,
    currentType: React.PropTypes.string
  }

  onClientChange = (e) => {
    if (e.target.value) {
      this.props.onClientChange(e.target.value);
    } else {
      this.props.onClientChange(this.getClientById(null));
    }
  }

  onChangeType = (e) => {
    if (e.target.value) {
      this.props.onTypeChange(e.target.value);
    } else {
      this.props.onTypeChange(null);
    }
  }

  getClientById = (id) => _.find(this.props.clients, (client) => client.client_id == id)

  getCallbacks = (app) => {
    let callbacks = [];
    const clientId = this.props.currentClient || app.client;
    const client = this.getClientById(clientId);
    if (client) {
      callbacks = client.callbacks ? (typeof client.callbacks === 'string' ? [ client.callbacks ] : client.callbacks) : [];
      return callbacks.map(call => ({ value: call, text: call }));
    } else {
      return [];
    }
  }

  getIsOpenId() {
    if (this.props.currentType) {
      return this.props.currentType === 'oidc';
    }
    return false;
  }

  renderOpenIdAdditionalFields = (application) => {
    const responseTypes = [
      { value: 'token', text: 'Single Page Application' },
      { value: 'code', text: 'Traditional Web Application' }
    ];
    if (!this.getIsOpenId()) {
      return null;
    }
    return (
      <div>
        <Field
          name="scope" component={InputText} label="Scope" type="text"
          placeholder="Insert a scope"
        />
        <Field
          name="response_type" component={InputCombo}
          options={responseTypes} label="Response Type"
        />
      </div>
    );
  }

  render() {
    if (this.props.loading) {
      return <div />;
    }
    const types = [
      { value: 'saml', text: 'SAML' },
      { value: 'oidc', text: 'OpenID-Connect' },
      { value: 'wsfed', text: 'WS-Federation' }
    ];
    const clients = this.props.clients.map(conn => ({ value: conn.client_id, text: conn.name }));
    const application = this.props.application;
    const callbacks = this.getCallbacks(application);
    const connections = this.props.connections.map(conn => ({ value: conn.name, text: conn.name }));

    return (<div>
      <div className="row">
        <div className="col-xs-12 wrapper">
          <Error message={this.props.error} />
        </div>
      </div>

      <form className="form-horizontal">
        <Field
          name="type" component={InputCombo}
          options={types} label="Type" onChange={this.onChangeType}
        />
        <Field
          name="client" component={InputCombo}
          options={clients} label="Application" onChange={this.onClientChange}
        />
        <Field name="name" component={InputText} label="Name" type="text" />
        {this.renderOpenIdAdditionalFields(application)}
        <Field
          name="logo" component={InputText} label="Logo" type="text"
          placeholder="Insert an url of an image to use as a icon"
        />
        <Field
          name="callback" component={InputCombo}
          options={callbacks} label="Callback"
        />
        <Field
          name="connection" component={InputCombo}
          options={connections} label="Connection"
        />
        <Field name="enabled" component={InputCheckBox} label="Enabled" />
      </form>
    </div>);
  }
}, { enableReinitialize: true });
