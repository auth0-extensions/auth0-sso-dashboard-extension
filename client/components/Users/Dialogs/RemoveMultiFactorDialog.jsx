import React, { Component, PropTypes } from 'react';
import { Error, Confirm } from '../../Dashboard';

export default class RemoveMultiFactorDialog extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    requesting: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    error: PropTypes.string
  }
  render() {
    const { userName, error, requesting, loading, onCancel, onConfirm } = this.props;

    return (
      <Confirm title="Remove Multi Factor Authentication?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to remove the multi factor authentication settings for <strong>{userName}</strong>?
          This will allow the user to authenticate and reconfigure a new device.
        </p>
      </Confirm>
    );
  }
}
