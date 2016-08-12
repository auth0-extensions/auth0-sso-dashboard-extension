import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import _ from 'lodash';

export default class ApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    updateApplication: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired,
    appId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {currentClient: null, currentType:null}
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

  getCallbacks = (app) =>{
    if(this.state.currentClient){
      return this.state.currentClient.callbacks?(typeof this.state.currentClient.callbacks=='string'?[this.state.currentClient.callbacks]:this.state.currentClient.callbacks):[]
    } else {
      let client = this.getClientById(app.client);
      if(client) {
        return client.callbacks?(typeof client.callbacks=='string'?[client.callbacks]:client.callbacks):[]
      } else {
        return [];
      }
    }
  }

  onChangeType = (e) => {
    if(e.target.value) {
      this.setState({currentType:e.target.value});
    } else {
      this.setState({currentType:null});
    }
  }

  getIsOpenId() {
    return this.state.currentType==='openid';
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const types = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    const clients = this.props.clients;
    const application = this.props.application.toJS();
    const callbacks = this.getCallbacks(application);
    const name = application.name||application.client;
    const clientId = application.client;
    const appLogo = application.logo;
    const appType = application.type;
    const appCallback = application.callback;
    const appEnabled = application.enabled;
    const appId = this.props.appId;

    const appResType =  application.response_type?application.response_type:'';
    const appScope =  application.scope?application.scope:'';
    const appConnection =  application.connection?application.connection:'';
    const response_tupes = ['token','code'];
    const connections = [];
    const isOpenId = this.getIsOpenId();

    return <div>
      <Alert stack={{limit: 3}} position='top' />
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        if(typeof obj['enabled']=='undefined'){
          obj['enabled'] = false;
        } else {
          obj['enabled'] = true;
        }
        return this.props.updateApplication(appId,obj, function(callback) {
          Alert.info('Application meta-data was successfully saved.',{
            effect: 'slide',
            onClose: callback
          });
        });
      }}>
        <div>
          <label>Name</label> <input name="name" className="form-control" type="text" defaultValue={name} required />
        </div>
        <div>
          <label>Client</label>
          <select onChange={this.onClientChange.bind(this)} className="form-control" name="client" defaultValue={clientId} required>
            <option value=""></option>
            {clients.map((client, index) => {
              return <option key={index}
                             value={client.client_id}>{client.name||client.client_id}</option>;
            })}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select className="form-control" name="type" defaultValue={appType} required onChange={this.onChangeType.bind(this)}>
            <option value=""></option>
            {types.map((type, index) => {
              return <option key={index}
                             value={type.value}>{type.text}</option>;
            })}
          </select>
      </div>
        {isOpenId ?
            <div>
              <label>Scope</label> <input name="scope" className="form-control" type="text"  defaultValue={appScope}/>
            </div>
            :''}
        {isOpenId ?
            <div>
              <label>Response Type</label>
              <select className="form-control" name="response_type" required defaultValue={appResType}>
                <option value=""></option>
                {response_tupes.map((r_type, index) => {
                  return <option key={index}
                                 value={r_type}>{r_type}</option>;
                })}
              </select>
            </div>
            :''}
      <div>
        <label>Logo</label> <input name="logo" className="form-control" type="url"  defaultValue={appLogo} />
        </div>
        <div>
          <label>Callback</label>
            <select className="form-control" name="callback" defaultValue={appCallback} required>
            <option value=""></option>
              {callbacks.map((callback, index) => {
                return <option key={index}
                               value={callback}>{callback}</option>;
              })}
          </select>
        </div>
        <div>
          <div>
            <label>Connection</label>
            <select className="form-control" name="callback" defaultValue={appConnection}>
              <option value=""></option>
              {connections.map((connection, index) => {
                return <option key={index}
                               value={connection}>{connection}</option>;
              })}
            </select>
          </div>
        <label>Enabled?</label> <input name="enabled" type="checkbox" value={true} style={{'marginLeft':'10px'}} defaultChecked={appEnabled} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
