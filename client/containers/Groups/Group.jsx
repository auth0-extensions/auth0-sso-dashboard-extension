import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Link } from 'react-router';
import { applicationActions, connectionActions } from '../../actions';
import './Group.css';
import { GroupInfo, GroupForm } from '../../components/Groups';
import { Confirm } from '../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    group: state.group.get('record'),
    error: state.group.get('error'),
    loading: state.group.get('loading'),
    groups: state.groups.get('records').toJS(),
    showModalCreate: state.createApplication.get('requesting')
  })

  static actionsToProps = {
    ...applicationActions,
    ...connectionActions
  }

  constructor(props) {
    super(props);

    this.state = {
      showModalDelete: false
    };
  }

  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  updateCurrentGroup = (data) => {
    this.props.updateGroup(this.props.params.id, data);
  }

  clickRemoveButton = () => {
    this.setState({ showModalDelete: true });
  }

  clickSubmitButton = () => {
    this.refs.groupForm.submit();
  }

  render() {
    const { group, loading, error } = this.props;
    const groupJSON = group.toJSON();
    const initialValues = {
      name: groupJSON.name
    };

    return (
      <div className="user">
        <Confirm
          title="Remove Group" show={this.state.showModalDelete} loading={false}
          onCancel={() => this.setState({ showModalDelete: false })}
          onConfirm={(e) => {
            this.props.deleteGroup(this.props.params.id, () => {
              history.back();
            });
          }}
        >
          <span>
            Do you really want to remove this group?
          </span>
        </Confirm>
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="settings-header">{group.get('name') || 'Group Settings'}</h2>
            <Link className="btn btn-transparent back-to-apps pull-right" to="/applications/settings">
              <span className="btn-icon icon-budicon-521" />
              Go back to Applications
            </Link>
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs id="sso-app-tabs" defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Settings">
                <GroupForm
                  ref="groupForm"
                  onSubmit={this.updateCurrentGroup}
                  initialValues={initialValues}
                  loading={loading}
                  group={groupJSON}
                  error={this.props.updateError}
                />
                <br />
                <div className="btn-div">
                  <button className="btn btn-info" onClick={this.clickSubmitButton}>Save Settings</button>
                </div>
                <br />
                <h5>Danger Zone</h5>
                <div className="red-border">
                  <p><strong>Warning!</strong> Once confirmed, this operation can't be undone! All linked apps will be ungrouped.</p>
                  <p><input
                    onClick={() => this.clickRemoveButton()} type="button" value="Delete Group"
                    className="btn btn-danger delete-client "
                  /></p>
                </div>
              </Tab>
              <Tab eventKey={2} title="Info">
                <GroupInfo loading={loading} group={group} error={error} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
});
