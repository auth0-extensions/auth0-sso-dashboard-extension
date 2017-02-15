import './CreateApplicationDialog.css';
import React, { Component, PropTypes } from 'react';
import { Error, Confirm } from '../Dashboard';
import { ApplicationForm } from '../../components/Applications';

export default class CreateApplicationDialog extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    createError: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    connections: PropTypes.array.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    createApplication: PropTypes.func.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired,
    requestCreateApplication: React.PropTypes.func.isRequired,
    cancelCreateApplication: React.PropTypes.func.isRequired,
    currentClient: React.PropTypes.string,
    currentType: React.PropTypes.string,
    currentName: React.PropTypes.string,
    onClientChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    onNameChange: React.PropTypes.func.isRequired
  }

  onConfirm = () => {
    this.refs.app_form.submit();
  }

  onCancel = () => this.props.cancelCreateApplication()

  createApplication = (data) => {
    this.props.createApplication(data);
  }

  render() {
    const { loading, clients, connections, error, showModal } = this.props;

    if (loading || error) {
      return <div />;
    }
    const initialValues = {
      client: this.props.currentClient,
      type: this.props.currentType,
      name: this.props.currentName
    };
    return (
      <div>
        <Confirm
          successClass="info"
          show={showModal}
          dialogClassName="create-app-modal"
          confirmMessage="Create"
          cancelMessage="Cancel"
          title="New Application"
          loading={loading}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        >
          <div className="user">
            <div className="spanTitle"><span className="username-text">Add new application</span></div>
            <div>
              <ApplicationForm
                ref="app_form"
                onSubmit={this.createApplication}
                initialValues={initialValues}
                onClientChange={this.props.onClientChange}
                onTypeChange={this.props.onTypeChange}
                onNameChange={this.props.onNameChange}
                loading={loading}
                application={{}}
                fetchRoles={this.props.fetchRoles}
                error={this.props.createError}
                clients={clients}
                currentClient={this.props.currentClient}
                currentType={this.props.currentType}
                currentName={this.props.currentName}
                connections={connections}
                inDialog={true}
              />
            </div>
          </div>
        </Confirm>
      </div>
    );
  }
}
