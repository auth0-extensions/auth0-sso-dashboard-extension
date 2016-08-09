import React, {Component} from 'react';
import { Link } from 'react-router';

export default class ApplicationsTable extends Component {
  static propTypes = {
    applications: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.applications !== this.props.applications;
  }

  render() {
    const {applications, renderActions} = this.props;
    return (
      <div id="cards-component" className="tab-pane">
        {applications.map((application, index) => {
          const logo = (application.client_metadata) ? application.client_metadata['sso-dashboard-logo'] : 'https://rawgit.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/fabrikam.svg';
          const type = (application.client_metadata) ? application.client_metadata['sso-dashboard-type'] : 'None';
          const enabled = (application.client_metadata && application.client_metadata['sso-dashboard-enabled'] == '1') ? 'Enabled' : 'Disabled';
          const name = application.name || application.client_id;

          return (
            <div className="col-xs-12 col-md-4" key={ application.client_id }>
              <article className="card-docs">
                <img className="img-circle" src={ logo } alt={ name } width="32"/>
                <h2 className="card-docs-title">{ name }</h2>
                <div className="card-docs-links">
                  <span href="" className="card-docs-link">{ type }</span>
                  <span href="" className="card-docs-link">{ enabled }</span>
                </div>
                <Link className="card-docs-more" to={`/applications/${application.client_id}`}>
                  Edit
                </Link>
              </article>
            </div>
          );
        })}
      </div>
    );
  }
}
