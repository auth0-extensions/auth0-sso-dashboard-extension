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
    return this.state.currentType==='openid';
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const types = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    const callbacks = this.getCallbacks();
    const clients = this.props.clients;

    const response_tupes = ['token','code'];
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
      <div>
          <label>Name</label> <input name="name" className="form-control" type="text"  required />
      </div>
      <div>
          <label>Client</label>
          <select onChange={this.onClientChange.bind(this)} className="form-control" name="client" required>
            <option value=""></option>
            {clients.map((client, index) => {
              return <option key={index}
                             value={client.client_id}>{client.name||client.client_id}</option>;
            })}
          </select>
      </div>

        <div>
          <label>Type</label>
          <select className="form-control" name="type" required onChange={this.onChangeType.bind(this)} >
            <option value=""></option>
            {types.map((type, index) => {
              return <option key={index}
                             value={type.value}>{type.text}</option>;
            })}
          </select>
        </div>
        {isOpenId ?
            <div>
              <label>Scope</label> <input name="scope" className="form-control" type="text" />
            </div>
            :''}
        {isOpenId ?
            <div>
              <label>Response Type</label>
              <select className="form-control" name="response_type" required>
                <option value=""></option>
                {response_tupes.map((r_type, index) => {
                  return <option key={index}
                                 value={r_type}>{r_type}</option>;
                })}
              </select>
            </div>
            :''}

      <div>
        <label>Logo</label> <input name="logo" className="form-control" type="url" />
      </div>
        <div>
          <label>Callback</label>
          <select className="form-control" name="callback" required>
            <option value=""></option>
            {callbacks.map((callback, index) => {
              return <option key={index}
                             value={callback}>{callback}</option>;
            })}
          </select>
        </div>
        <div>
          <label>Connection</label>
          <select className="form-control" name="connection">
            <option value=""></option>
            {connections.map((connection, index) => {
              return <option key={index}
                             value={connection.name}>{connection.name}</option>;
            })}
          </select>
        </div>
        <div>
          <label>Enabled?</label> <input name="enabled" type="checkbox" value={true} style={{'marginLeft':'10px'}} />
        </div>
        <button className="btn btn-success appFormSubmit">Update</button>
      </form>
    </div>
  }
};
