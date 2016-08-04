import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel } from '../Dashboard';

export default class UserProfile extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { user, error, loading } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <Json jsonObject={user.toJS()} />
        </Error>
      </LoadingPanel>
    );
  }
}
