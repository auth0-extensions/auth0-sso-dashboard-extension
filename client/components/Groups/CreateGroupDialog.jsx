import './CreateGroupDialog.css';
import React, { Component, PropTypes } from 'react';
import { Error, Confirm } from '../Dashboard';
import { GroupForm } from './GroupForm';

export default class CreateGroupDialog extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    createError: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    createGroup: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    groups: React.PropTypes.object.isRequired,
  }

  onConfirm = () => {
    this.refs.groupForm.submit();
  }

  createGroup = (data) => {
    this.props.createGroup(data);
  }

  render() {
    const { loading, clients, connections, error, showModal } = this.props;

    if (loading || error) {
      return <div />;
    }
    
    return (
      <div>
        <Confirm
          successClass="info"
          show={showModal}
          dialogClassName="create-app-modal"
          confirmMessage="Create"
          cancelMessage="Cancel"
          title="New Group"
          loading={loading}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        >
          <div className="user">
            <div className="spanTitle"><span className="username-text">Add new application</span></div>
            <div>
              <GroupForm
                ref="groupForm"
                onSubmit={this.createGroup}
                loading={loading}
                group={{}}
                error={this.props.createError}
                groups={this.props.groups}
              />
            </div>
          </div>
        </Confirm>
      </div>
    );
  }
}
