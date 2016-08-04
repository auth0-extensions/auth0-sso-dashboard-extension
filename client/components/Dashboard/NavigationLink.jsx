import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class NavigationLink extends Component {

  render() {
    const { route } = this.props;

    const linkClass = classNames({
      active: this.context.router.isActive(route)
    });
    return (
      <li className={linkClass}>
        <Link to={`${route}`}>
          <span className="tab-title">
            {this.props.title}
          </span>
        </Link>
      </li>
    );
  }
}

NavigationLink.propTypes = {
  route: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired
};

NavigationLink.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default NavigationLink;
