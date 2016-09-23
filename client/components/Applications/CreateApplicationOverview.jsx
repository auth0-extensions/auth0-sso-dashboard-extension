import React, {Component, PropTypes} from 'react'
import {CreateApplicationForm} from './';
import {Error, Confirm} from '../Dashboard';

export default class CreateApplication extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    connections: PropTypes.array.isRequired,
    createApplication: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired
  }

  onConfirm = () => {
    $('.appFormSubmit').click();
  }

  onCancel = () => {
    return this.props.onClose();
  }

  applicationIsSaved = () => {
    this.props.onClose();
  }

  render() {
    const {loading, createApplication, clients, connections, error, showModal}  = this.props;

    return (
      <div>
        <Confirm successClass="info" confirmMessage="Create" cancelMessage="Cancel" title="New Application"
          show={showModal} loading={loading} onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm}>
          <div className="user">
            <div className="spanTitle"><span className="username-text">Add new application</span></div>
            <CreateApplicationForm
              loading={loading}
              createApplication={ createApplication }
              applicationIsSaved={ this.applicationIsSaved }
              connections={ connections }
              error={error}
              clients={ clients }
              />
          </div>
        </Confirm>
      </div>
    );
  }
}
