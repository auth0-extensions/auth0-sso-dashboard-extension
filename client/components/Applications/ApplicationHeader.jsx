import React, { Component, PropTypes } from 'react';

export default class ApplicationHeader extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.loading !== this.props.loading;
  }

  render() {
    const application = this.props.application.toJS();
    return (
      <div className="user-header">
        <h4>
                  <span className="name user-head-nickname">
                    { application.name }
                  </span>
        </h4>
      </div>
    );
  }
}
