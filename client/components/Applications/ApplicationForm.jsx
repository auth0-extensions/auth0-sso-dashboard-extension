import React, { PropTypes, Component } from 'react';
import { InputCombo, InputText, InputCheckBox } from '../Dashboard';
import { Error } from 'auth0-extension-ui';
import _ from 'lodash';

import createForm from '../../utils/createForm';

export default createForm('application', class extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    authorizationEnabled: PropTypes.bool.authorizationEnabled,
    groups: PropTypes.array.isRequired,
    clients: React.PropTypes.array.isRequired,
    connections: React.PropTypes.array.isRequired,
    onClientChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    onNameChange: React.PropTypes.func.isRequired,
    currentClient: React.PropTypes.string,
    currentType: React.PropTypes.string,
    fields: React.PropTypes.object,
    inDialog: React.PropTypes.boolean
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
    'groups',
    'customURLEnabled',
    'customURL',
    'enabled'
  ];

  isNotCustomApp() {
    return this.props.fields.type.value !== 'custom';
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

  onNameFocus = () => {
    const { fields, clients } = this.props;

    const client = clients.find(
      (conn) => (conn.client_id === fields.client.value)
    );

    if (client) {
      this.props.onNameChange(client.name);
      fields.name.onChange(client.name);
    }
  }

  componentDidMount = () => {
    this.refs.client.props.field.onChange = this.onClientChange;
    this.refs.type.props.field.onChange = this.onChangeType;
    this.refs.name.props.field.onFocus = this.onNameFocus;
  }

  componentDidUpdate() {
    const { fields } = this.props;

    // Enable custom URL if it's a custom app
    if ((!this.isNotCustomApp()) && !fields.customURLEnabled.value) {
      fields.customURLEnabled.onChange(true);
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

  getGroups = () => {
    return this.props.groups.toJS().map(item => ({ value: item._id, text: item.name }));
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
    if ((!this.getIsOpenId()) || (!this.isNotCustomApp())) {
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

  renderGroups = (groups) => {
    if (!this.props.authorizationEnabled) {
      return '';
    }

    return (
      <InputCombo
        field={this.props.fields.groups} options={groups} fieldName="groups"
        label="Groups" ref="groups"
      />
    );
  }

  renderCustomURLCheckbox = () => {
    const { fields } = this.props;

    return this.isNotCustomApp() ? (
      <InputCheckBox
        field={fields.customURLEnabled}
        fieldName="customURLEnabled"
        label="Custom URL"
        ref="customURLEnabled"
      />
    ) : null;
  }

  renderCustomURLField = () => {
    if (!this.props.fields.customURLEnabled.value) {
      return null;
    }

    const label = this.isNotCustomApp() ? '' : 'URL';

    return (
      <div>
        {this.props.inDialog && <br/>}
        <InputText
          field={this.props.fields.customURL} fieldName="customURL" label={label} ref="customURL"
          placeholder="Add your customer URL here which will be invoked when users click the icon."
        />
      </div>
    );
  }

  componentDidUpdate() {
    const { fields, clients } = this.props;

    // Enable custom URL if it's a custom app
    if ((!this.isNotCustomApp()) && !fields.customURLEnabled.value) {
      fields.customURLEnabled.onChange(true);
    }

    // Change app name when client changes
    if ((typeof fields.name.value === 'undefined') && fields.client.value) {
      const client = clients.find(
        (conn) => (conn.client_id === fields.client.value)
      );

      fields.name.onChange(
        client.name
      );
    }
  }

  render() {
    if (this.props.loading) {
      return <div />;
    }
    const types = [
      { value: 'saml', text: 'SAML' },
      { value: 'oidc', text: 'OpenID-Connect' },
      { value: 'wsfed', text: 'WS-Federation' },
      { value: 'custom', text: 'Custom application' }
    ];
    const fields = this.props.fields;
    const clients = this.props.clients.map(conn => ({ value: conn.client_id, text: conn.name }));
    const application = this.props.application;
    const callbacks = this.getCallbacks(application);
    const groups = this.getGroups();
    const connections = this.props.connections.map(conn => ({ value: conn.name, text: conn.name }));

    return (<div>
      <div className="row">
        <div className="col-xs-12 wrapper">
          <Error message={this.props.error} />
        </div>
      </div>
      <form className="appForm updateAppForm">
        <InputCombo field={fields.type} options={types} fieldName="type" label="Type" ref="type" />
        {this.isNotCustomApp() &&
          <InputCombo
            field={fields.client} options={clients} fieldName="client" label="Application"
            ref="client"
          />
        }
        <InputText
          field={fields.name} fieldName="name" label="Name" ref="name"
          placeholder="insert a name for users to see"
        />
        {this.renderOpenIdAdditionalFields(application)}
        <InputText
          field={fields.logo} fieldName="logo" label="Logo" ref="logo"
          placeholder="Insert an url of an image to use as an icon"
        />
        {this.isNotCustomApp() &&
          <div>
            <InputCombo
              field={fields.callback} options={callbacks} fieldName="callback"
              label="Callback" ref="callback"
            />
            <InputCombo
              field={fields.connection} options={connections} fieldName="connection"
              label="Connection" ref="connection"
            />
          </div>
        }
        {this.renderGroups(groups)}
        {this.renderCustomURLCheckbox()}
        {this.renderCustomURLField()}
        {(!this.props.fields.customURLEnabled.value) && this.props.inDialog && <br/>}
        <InputCheckBox
          field={fields.enabled}
          fieldName="enabled"
          label="Enabled"
          ref="enabled"
        />
      </form>
    </div>);
  }
});
