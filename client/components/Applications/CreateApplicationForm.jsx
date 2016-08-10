import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


export default class CreateApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    createApplication: PropTypes.func.isRequired
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const clients = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    return <div>
      <Alert stack={{limit: 3}} position='top' />
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        return this.props.createApplication(obj, function(callback) {
          Alert.info('Application was successfully saved.',{
            effect: 'slide',
            onClose: callback
          });
        });
      }}>
      <div>
          <label>Name</label> <input name="name" className="form-control" type="text"  required />
      </div>
      <div>
          <label>Client</label>
          <select className="form-control" name="client" required>
            <option value=""></option>
            {clients.map((option, index) => {
              return <option key={index}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
      </div>
      <div>
          <label>Type</label>
          <select className="form-control" name="type" required>
            <option value=""></option>
            {clients.map((option, index) => {
              return <option key={index}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
      </div>
      <div>
        <label>Name</label> <input name="logo" className="form-control" type="url"  required />
      </div>
        <div>
          <label>Callback</label>
          <select className="form-control" name="callback" required>
            <option value=""></option>
            {clients.map((option, index) => {
              return <option key={index}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
        </div>
      <br />
      <button className="btn btn-success">Create</button>
      </form>
    </div>
  }
}
