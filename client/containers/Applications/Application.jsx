import React, { Component, PropTypes } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { applicationActions } from '../../actions';
import './Application.css';
import { ApplicationHeader, ApplicationInfo, ApplicationForm } from '../../components/Applications';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    application: state.application
  })

  static actionsToProps = {
    ...applicationActions
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    fetchConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplication(this.props.params.id);
  }

  render() {
    const { application } = this.props;
    return (
      <div className="user">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Application Details</h2>
            <div className="pull-right">
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ApplicationHeader loading={application.get('loading')} application={application.get('record')} error={application.get('error')} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Info">
                <ApplicationInfo loading={application.get('loading')} application={application.get('record')} error={application.get('error')} />
              </Tab>
              <Tab eventKey={2} title="Update">
                <ApplicationForm updateApplication={this.props.updateApplication} loading={application.get('loading')} application={application.get('record')} error={application.get('error')} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
});
