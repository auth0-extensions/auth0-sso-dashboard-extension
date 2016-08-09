import React, {Component} from 'react';

export default class ApplicationsList extends Component {
  static propTypes = {
    applications: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.applications !== this.props.applications;
  }

  render() {
    const {applications} = this.props;
    return (
      <div>
        {applications.map((application) => {
          const logo = (application.client_metadata) ? application.client_metadata['sso-dashboard-logo'] : 'https://rawgit.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/fabrikam.svg';
          const name = application.name || application.client_id;

          return (
            <div className="user-app" key={ application.client_id }>
                <img className="img-circle" src={ logo } alt={ name } width="32"/>
                <h4 className="card-docs-title">{ name }</h4>
            </div>
          );
        })}
      </div>
    );
  }
}
