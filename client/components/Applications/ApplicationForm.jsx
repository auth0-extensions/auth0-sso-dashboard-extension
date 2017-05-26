import './ApplicationForm.css';

import React, { PropTypes, Component } from 'react';
import { Error, InputCombo, InputText, InputCheckBox } from 'auth0-extension-ui';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

class ApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    authorizationEnabled: PropTypes.bool,
    groups: PropTypes.array.isRequired,
    clients: React.PropTypes.array.isRequired,
    connections: React.PropTypes.array.isRequired,
    onClientChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    onNameChange: React.PropTypes.func.isRequired,
    currentClient: React.PropTypes.string,
    currentType: React.PropTypes.string,
    inDialog: React.PropTypes.bool,
    isNotCustomApp: React.PropTypes.bool,
    customURLEnabled: React.PropTypes.bool,
    changeFieldValue: React.PropTypes.func,
    name: React.PropTypes.string,
    client: React.PropTypes.string
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
    const { clients } = this.props;

    const client = clients.find(
      (conn) => (conn.client_id === this.props.client.value)
    );

    if (client) {
      this.props.onNameChange(client.name);
      this.props.changeFieldValue('name', client.name);
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
    }
    
    return [];
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
    if ((!this.getIsOpenId()) || (!this.props.isNotCustomApp)) {
      return null;
    }
    return (
      <div>
        <Field
          component={InputText}
          name="scope" label="Scope"
          placeholder="Insert a scope"
        />
        <Field
          component={InputCombo}
          options={responseTypes}
          name="response_type" label="Response Type"
        />
      </div>
    );
  }

  renderGroups = (groups) => {
    if (!this.props.authorizationEnabled) {
      return '';
    }

    return (
      <Field
        component={InputCombo}
        options={groups} name="groups"
        label="Groups"
      />
    );
  }

  renderCustomURLCheckbox = () => {
    return this.props.isNotCustomApp ? (
      <Field
        component={InputCheckBox}
        name="customURLEnabled"
        label="Custom URL"
      />
    ) : null;
  }

  renderCustomURLField = () => {
    if (!this.props.customURLEnabled) {
      return null;
    }

    return (
      <div className="form-group">
        {!this.props.isNotCustomApp &&
          <label htmlFor="customURL" className="control-label col-xs-2">
            URL
          </label>
        }
        <div className={`col-xs-9 ${this.props.isNotCustomApp ? 'col-xs-offset-2' : ''} ${this.props.inDialog ? 'in-dialog' : ''}`}>
          <Field
            component={InputText}
            name="customURL"
            placeholder="Add your customer URL here which will be invoked when users click the icon."
          />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    const { name, client, isNotCustomApp, customURLEnabled, clients } = this.props;

    // Enable custom URL if it's a custom app
    if ((!isNotCustomApp) && !customURLEnabled) {
      this.props.changeFieldValue('customURLEnabled', true);
    }

    // Change app name when client changes
    if ((typeof name === 'undefined') && client) {
      const clientObj = clients.find(
        (conn) => (conn.client_id === client)
      );  
      this.props.changeFieldValue('name', clientObj.name);
    }

    // Enable custom URL if it's a custom app
    if ((!isNotCustomApp) && !customURLEnabled) {
      this.props.changeFieldValue('customURLEnabled', true);
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
    const clients = this.props.clients.map(conn => ({ value: conn.client_id, text: conn.name }));
    const application = this.props.application;
    const callbacks = this.getCallbacks(application);
    const connections = this.props.connections.map(conn => ({ value: conn.name, text: conn.name }));
    const groups = Object.keys(this.props.groups).map((groupKey) => {
      const group = this.props.groups[groupKey];
      return { value: groupKey, text: group.name };
    });

    return (<div>
      <div className="row">
        <div className="col-xs-12 wrapper">
          <Error message={this.props.error} />
        </div>
      </div>
      <form className="appForm updateAppForm">
        <Field
          component={InputCombo}
          options={types}
          name="type"
          label="Type"
          onChange={this.onChangeType}
        />
        {this.props.isNotCustomApp &&
          <Field
            component={InputCombo}
            options={clients} name="client" label="Application"
            onChange={this.onClientChange}
          />
        }
        <Field
          component={InputText}
          name="name" label="Name" onChange={this.onNameFocus}
          placeholder="insert a name for users to see"
        />
        <Field
          component={InputCombo}
          options={groups} name="group"
          label="Group"
        />
        {this.renderOpenIdAdditionalFields(application)}
        <Field
          component={InputText}
          name="logo" label="Logo"
          placeholder="Insert an url of an image to use as an icon"
        />
        {this.props.isNotCustomApp &&
          <div>
            <Field
              component={InputCombo}
              options={callbacks} name="callback"
              label="Callback"
            />
            <Field
              component={InputCombo}
              options={connections} name="connection"
              label="Connection"
            />
          </div>
        }
        {this.renderGroups(groups)}
        {this.renderCustomURLCheckbox()}
        {this.renderCustomURLField()}
        <Field
          component={InputCheckBox}
          name="enabled"
          label="Enabled"
        />
      </form>
    </div>);
  }
}

const formName = 'application';

const selector = formValueSelector(formName);
const mapStateToProps = state => ({
  isNotCustomApp: selector(state, 'type') !== 'custom',
  customURLEnabled: selector(state, 'customURLEnabled'),
  name: selector(state, 'name'),
  client: selector(state, 'client')
});
const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field, value) => dispatch(change(formName, field, value))
});

const form = connect(mapStateToProps, mapDispatchToProps)(ApplicationForm);

const connectedForm = reduxForm({
  form: formName,
  enableReinitialize: true
})(form);

export default connectedForm;
