import React, { Component } from 'react';
import { Link } from 'react-router';
import varstring from 'varstring';

export default class ApplicationsList extends Component {
  static propTypes = {
    applications: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    groups: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.applications !== this.props.applications) ||
           (nextProps.groups !== this.props.groups);
  }

  render() {
    const { applications, groups } = this.props;

    const unpackApp = (appId) => {
      const app = applications[appId];
      app.id = appId;
      return app;
    };
    
    const apps = applications.constructor == Array ? applications : Object.keys(applications).map(unpackApp);

    const ungroupedApps = apps.filter(app => (typeof app.group === 'undefined' || app.group === ''));

    const groupedApps = Object.keys(groups).map((groupId) => {
      const group = { ...groups[groupId] };
      group.apps = group.apps.map(applications.constructor == Array ? (appId, i) => {
        const app = applications.find(application => application.id === appId);
        return app ? app : null;
      } : unpackApp).filter((item) => item !== null);

      console.log('group.apps', group.apps);
      
      return group.apps.length > 0 ? group : null;
    })

    const allApps = [ ...groupedApps, {
      name: "Ungrouped apps",
      apps: ungroupedApps
    }].filter((group) => group !== null);;

    console.log('allApps', allApps);

    return (
      <div>
        {allApps.map((group, i) => {
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
