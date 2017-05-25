import React, { Component } from 'react';
import varstring from 'varstring';

export default class ApplicationsList extends Component {
  static propTypes = {
    applications: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.applications !== this.props.applications);
  }

  render() {
    const { applications } = this.props;

    return (
      <div>
        {applications.map((group, i) => {
          if (group.apps.length > 0) {
            return (
              <div className="row col-sm-12" key={i}>
                <h3>{group.name} <small>({group.apps.length} app{group.apps.length === 1 ? '' : 's'})</small></h3>
                {group.apps.map((app, i) => {
                  const key = app.id || i;
                  const logo = (app.logo) ? app.logo : 'https://cdn.auth0.com/manage/v0.3.1866/img/badge-grey.svg';
                  const name = app.name || key;

                  const link = app.customURLEnabled ? varstring(app.customURL, {
                    connection: app.connection,
                    client_id: app.client,
                    callback: app.callback
                  }) : app.loginUrl;

                  console.log('link', link);

                  return (
                    <a href={link} target="_blank" key={i}>
                      <div className="user-app">
                        <div className="image-container">
                          <img className="img-circle" src={logo} alt={name} width="32" />
                        </div>
                        <div className="card-docs-title">{ name }</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            );
          }
        })}
      </div>
    );
  }
}
