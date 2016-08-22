import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import _ from 'lodash';


export default class CreateApplicationForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    connections: PropTypes.array.isRequired,
    createApplication: PropTypes.func.isRequired,
    applicationIsSaved: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      currentClient: null,
      currentType:null
    }
  }

  getClientById = (id) => {
    return  _.find(this.props.clients, function(client){ return client.client_id == id })
  }

  onClientChange = (e) =>{
    if(e.target.value) {
      this.setState({currentClient:this.getClientById(e.target.value)});
    } else {
      this.setState({currentClient:null});
    }
  }

  getCallbacks = () =>{
    if(this.state.currentClient){
      return this.state.currentClient.callbacks?(typeof this.state.currentClient.callbacks=='string'?[this.state.currentClient.callbacks]:this.state.currentClient.callbacks):[]
    } else {
      return [];
    }
  }

  onChangeType = (e) => {
    if(e.target.value) {
      this.setState({currentType:e.target.value});
    } else {
      this.setState({currentType:null});
    }
  }

  getIsOpenId = () =>{
    return this.state.currentType==='oidc';
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const types = [{value:'saml',text:'SAML'},{value:'oidc',text:'OpenID-Connect'},{value:'wsfed',text:'WS-Federation'}];
    const callbacks = this.getCallbacks();
    const clients = this.props.clients;

    const response_types = [{value:'token',text:'Single Page Application'},{value:'code',text:'Traditional Web Application'}];
    const connections = this.props.connections;
    const isOpenId = this.getIsOpenId();
    return <div>
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        if(typeof obj['enabled']=='undefined'){
          obj['enabled'] = false;
        }
        return this.props.createApplication(obj, function() {
          this.props.applicationIsSaved();
        }.bind(this));
      }}>
        <div className="form-group row">
          <label htmlFor="app_client">Application</label>
          <div className="col-xs-10">
            <select id="app_client" onChange={this.onClientChange.bind(this)} className="form-control" name="client" required>
              <option value="">Select...</option>
              {clients.map((client, index) => {
                return <option key={index}
                               value={client.client_id}>{client.name||client.client_id}</option>;
              })}
            </select>
          </div>
        </div>
      <div className="form-group row">
        <label htmlFor="app_name">Name</label>
        <div className="col-xs-10">
        <input placeholder="insert a name for users to see" name="name" id="app_name" className="form-control" type="text"  required />
        </div>
      </div>
        <div className="form-group row">
          <label htmlFor="app_type">Type</label>
          <div className="col-xs-10">
          <select id="app_type" className="form-control" name="type" required onChange={this.onChangeType.bind(this)} >
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
               <input placeholder="Insert a scope" id="app_scope" name="scope" className="form-control" type="text" />
            </div>
            </div>
            :''}
        {isOpenId ?
            <div className="form-group row">
              <label htmlFor="app_res_type">Response Type</label>
              <div className="col-xs-10">
              <select id="app_res_type" className="form-control" name="response_type" required>
                <option value="">Select...</option>
                {response_types.map((r_type, index) => {
                  return <option key={index}
                                 value={r_type.value}>{r_type.text}</option>;
                })}
              </select>
            </div>
            </div>
            :''}

      <div className="form-group row">
        <label htmlFor="app_logo_url">Icon Url</label>
        <div className="col-xs-10">
        <input placeholder="Insert an url of an image to use as a icon" id="app_logo_url" name="logo" className="form-control" type="url" />
          <div className="username-text app_tip">Tip: Choose the logo or image that represent the app</div>
      </div>
      </div>
        <div className="form-group row">
          <label htmlFor="app_callback">Callback</label>
          <div className="col-xs-10">
          <select id="app_callback" className="form-control" name="callback" required>
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
          <select id="app_connection" className="form-control" name="connection">
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
          <input id="app_enabled" name="enabled" type="checkbox" value={true} />
        </div>
        </div>
        <button className="btn btn-success appFormSubmit">Update</button>
      </form>
    </div>
  }
};
