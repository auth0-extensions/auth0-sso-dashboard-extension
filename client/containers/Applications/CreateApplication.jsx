import React, { Component, PropTypes } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { applicationActions } from '../../actions';
import './Application.css';
import { CreateApplicationForm } from '../../components/Applications';
import { Link } from 'react-router';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
  })

  static actionsToProps = {
    ...applicationActions
  }

  render() {
    return (
        <div className="user">
          <div className="row content-header">
            <div className="col-xs-12">
              <h2 className="pull-left">New Application</h2>
              <div className="pull-right">
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
                <div className="user-header">
                    <h4>
                  <span className="name user-head-nickname">
                    -
                    <Link to="/applications/settings"> back </Link>
                  </span>
                    </h4>
                </div>
            </div>
          </div>
            <CreateApplicationForm loading={false} createApplication={this.props.createApplication} error={null} />
        </div>
    );
  }
});
