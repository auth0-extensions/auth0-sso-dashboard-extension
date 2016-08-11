import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import _ from 'lodash';

export default class CreateApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    createApplication: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {currentClient: null}
  }

  getClientById(id) {
    return  _.find(this.props.clients, function(client){ return client.client_id == id })
  }

  onClientChange = (e)=>{
    if(e.target.value) {
      this.setState({currentClient:this.getClientById(e.target.value)});
    } else {
      this.setState({currentClient:null});
    }
  }

  getCallbacks(){
    if(this.state.currentClient){
      return this.state.currentClient.callbacks?(typeof this.state.currentClient.callbacks=='string'?[this.state.currentClient.callbacks]:this.state.currentClient.callbacks):[]
    } else {
      return [];
    }
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const types = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    const callbacks = this.getCallbacks();
    const clients = this.props.clients;
    return <div>
      <Alert stack={{limit: 3}} position='top' />
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        $('.appFormSubmit').remove();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        if(typeof obj['enabled']=='undefined'){
          obj['enabled'] = false;
        }
        return this.props.createApplication(obj, function() {
          Alert.info('Application was successfully saved.',{
            effect: 'slide',
            timeout: 2500,
            onClose: function(){
              history.back();
            }.bind(this)
          });
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
          <select className="form-control" name="type" required>
            <option value=""></option>
            {types.map((type, index) => {
              return <option key={index}
                             value={type.value}>{type.text}</option>;
            })}
          </select>
      </div>
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
          <label>Enabled?</label> <input name="enabled" type="checkbox" value={true} style={{'marginLeft':'10px'}} />
        </div>
        <br />
        <button className="btn btn-success appFormSubmit">Update</button>
      </form>
    </div>
  }
}
