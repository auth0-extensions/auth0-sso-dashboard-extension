import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel } from '../Dashboard';

export default class GroupInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    group: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.loading !== this.props.loading;
  }

  render() {
    const { group, error, loading } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <Json jsonObject={group.toJS()} />
        </Error>
      </LoadingPanel>
    );
  }
}
