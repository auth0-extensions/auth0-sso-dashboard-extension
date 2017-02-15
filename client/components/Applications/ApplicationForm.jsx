import React, { PropTypes, Component } from 'react';
import { InputCombo, InputText, InputCheckBox, Error } from '../Dashboard';
import { Multiselect } from 'auth0-extension-ui';
import { Field } from 'redux-form';
import _ from 'lodash';

import createForm from '../../utils/createForm';

export default createForm('application', class extends Component {
  static stateToProps = (state) => ({
    roles: state.roles
  })

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired,
    connections: React.PropTypes.array.isRequired,
    onClientChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    currentClient: React.PropTypes.string,
    currentType: React.PropTypes.string
  }

  static formFields = [
    'client',
    'name',
    'type',
    'scope',
    'response_type',
    'logo',
    'callback',
    'connection',
    'roles',
    'enabled'
  ];

  onClientChange = (e) => {
    if (e.target.value) {
      this.props.onClientChange(e.target.value);
      this.props.fetchRoles(e.target.value);
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

  componentDidMount = () => {
    this.refs.client.props.field.onChange = this.onClientChange;
    this.refs.type.props.field.onChange = this.onChangeType;
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
        <InputText
          field={this.props.fields.scope} fieldName="scope" label="Scope" ref="scope"
          placeholder="Insert a scope"
        />
        <InputCombo
          field={this.props.fields.response_type} options={responseTypes}
          fieldName="response_type" label="Response Type"
          ref="response_type"
        />
      </div>
    );
  }

  renderRoles = () => {
    if (!this.props.roles) {
      return null;
    }

    const roles = _.map(this.props.roles.get('records').toJS(), item => ({ value: item._id, text: item.name }));

    return (
      <InputCombo
        field={this.props.fields.roles} options={roles} fieldName="roles"
        label="Roles" ref="roles"
      />
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
    const fields = this.props.fields;
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
      <form className="appForm updateAppForm">
        <InputCombo field={fields.type} options={types} fieldName="type" label="Type" ref="type" />
        <InputCombo
          field={fields.client} options={clients} fieldName="client" label="Application"
          ref="client"
        />
        <InputText
          field={fields.name} fieldName="name" label="Name" ref="name"
          placeholder="insert a name for users to see"
        />
        {this.renderOpenIdAdditionalFields(application)}
        <InputText
          field={fields.logo} fieldName="logo" label="Logo" ref="logo"
          placeholder="Insert an url of an image to use as a icon"
        />
        <InputCombo
          field={fields.callback} options={callbacks} fieldName="callback"
          label="Callback" ref="callback"
        />
        <InputCombo
          field={fields.connection} options={connections} fieldName="connection"
          label="Connection" ref="connection"
        />
        {this.renderRoles()}
        <InputCheckBox field={fields.enabled} fieldName="enabled" label="Enabled" ref="enabled" />
      </form>
    </div>);
  }
});
