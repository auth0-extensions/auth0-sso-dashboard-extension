import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';

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

  getInitialState() {
    return {value: 'Hello!'};
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
    const appEnabled = application.client_metadata&&application.client_metadata['sso-dashboard-enabled']?application.client_metadata['sso-dashboard-enabled']:false;
    return <div>
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        return this.props.updateApplication(application.client_id,obj);
      }}>
      <div>
          <label>Type</label>
          <select className="form-control" name="sso-dashboard-type" required>
            <option value=""></option>
            {options.map((option, index) => {
              return <option key={index}
                             selected={appType == option.value}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
      </div>
      <div>
        <label>Logo</label> <input name="sso-dashboard-logo" className="form-control" type="text"
                                   defaultValue={appLogo}
                                   required />
      </div>
      <div>
        <label>Enabled?</label> <input name="sso-dashboard-enabled" type="checkbox" value={1} style={{'margin-left':'10px'}} defaultChecked ={appEnabled} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
