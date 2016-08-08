import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel } from '../Dashboard';

export default class ApplicationInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.loading !== this.props.loading;
  }

  render() {
    const { application, error, loading } = this.props;
    return (
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error}>
            <Json jsonObject={application.toJS()} />
          </Error>
        </LoadingPanel>
    );
  }
}
