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

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const application = this.props.application.toJS();
    return <div>
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        application.client_metadata = obj;
        return this.props.updateApplication(application.client_id,application);
      }}>
      <InputCombo field={'sso-dashboard-type'} name='sso-dashboard-type' fieldName='sso-dashboard-type' options={[{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}]} label='Protocol'/>
      <InputText field={'sso-dashboard-logo'} name='sso-dashboard-logo' fieldName='sso-dashboard-logo'  label='Logo' value='test'/>
      <div>
        <label>Enabled?</label> <input name="sso-dashboard-enabled" type="checkbox" style={{'margin-left':'10px'}} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
