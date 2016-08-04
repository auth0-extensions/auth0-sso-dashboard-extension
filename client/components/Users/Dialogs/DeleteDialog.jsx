import React, { Component, PropTypes } from 'react';
import { Error, Confirm } from '../../Dashboard';

export default class DeleteDialog extends Component {
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
      <Confirm title="Delete User?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to delete <strong>{userName}</strong>?
          This will completely remove the user and cannot be undone.
        </p>
      </Confirm>
    );
  }
}
