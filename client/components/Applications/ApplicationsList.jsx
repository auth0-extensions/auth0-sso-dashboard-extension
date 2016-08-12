import React, {Component} from 'react';
import { Link } from 'react-router';

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
        {Object.keys(applications).map((key) => {
          const app = applications[key];
          const logo = (app.logo) ? app.logo : 'https://cdn.auth0.com/manage/v0.3.1866/img/badge-grey.svg';
          const name = app.name || key;
          const link = app.login_url;

          return (
            <div className="user-app" key={ key }>
              <a href={ link } target="_blank">
                <div className="image-container">
                  <img className="img-circle" src={ logo } alt={ name } width="32"/>
                </div>
              </a>
              <div className="card-docs-title">{ name }</div>
            </div>
          );
        })}
      </div>
    );
  }
}
