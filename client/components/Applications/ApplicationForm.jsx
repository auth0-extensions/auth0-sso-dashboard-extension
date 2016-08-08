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
        return this.props.updateApplication(application.client_id,obj);
      }}>
      <div>
          <label>Type</label>
          <select className="form-control" name="sso-dashboard-type">
            <option value="">Select...</option>;
            <option value="saml">saml</option>;
            <option value="openid">openid</option>;
            <option value="ws-fed">ws-fed</option>;
          </select>
      </div>
        <br />
      <div>
        <label>Logo</label> <input name="sso-dashboard-logo" className="form-control" type="text" value="1" />
      </div>
        <br />
      <div>
        <label>Enabled?</label> <input name="sso-dashboard-enabled" type="checkbox" value={1} style={{'margin-left':'10px'}} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
