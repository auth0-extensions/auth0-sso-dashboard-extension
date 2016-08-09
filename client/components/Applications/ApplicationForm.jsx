import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


export default class ApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    updateApplication: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.loading !== this.props.loading;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const application = this.props.application.toJS();
    const options = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    const appLogo = application.client_metadata&&application.client_metadata['sso-dashboard-logo']?application.client_metadata['sso-dashboard-logo']:'';
    const appType = application.client_metadata&&application.client_metadata['sso-dashboard-type']?application.client_metadata['sso-dashboard-type']:'';
    const appEnabled = application.client_metadata&&application.client_metadata['sso-dashboard-enabled']?application.client_metadata['sso-dashboard-enabled']=='1':false;
    return <div>
      <Alert stack={{limit: 3}} position='top' />
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        if(!obj['sso-dashboard-enabled'])
          obj['sso-dashboard-enabled']='0';
        return this.props.updateApplication(application.client_id,obj, function(callback) {
          Alert.info('Application meta-data was successfully saved.',{
            effect: 'slide',
            onClose: callback
          });
        });
      }}>
      <div>
          <label>Type</label>
          <select className="form-control" name="sso-dashboard-type" defaultValue={appType} required>
            <option value=""></option>
            {options.map((option, index) => {
              return <option key={index}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
      </div>
      <div>
        <label>Logo</label> <input name="sso-dashboard-logo" className="form-control" type="url"
                                   defaultValue={appLogo}
                                   required />
      </div>
      <div>
        <label>Enabled?</label> <input name="sso-dashboard-enabled" type="checkbox" value={1} style={{'marginLeft':'10px'}} defaultChecked={appEnabled} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
