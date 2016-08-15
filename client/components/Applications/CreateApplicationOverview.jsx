import React, { Component, PropTypes } from 'react'
import { CreateApplicationForm } from './';
import { Error, Confirm } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

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

    applicationIsSaved  = () => {
        this.props.onClose();
        Alert.info('Application was successfully saved.',{
            effect: 'slide',
            timeout: 2500,
            onClose: function(){
                 this.props.fetchApplications();
            }.bind(this)
        });
    }

  render() {
    const { loading, createApplication, clients, connections, error, showModal}  = this.props;
    return (
        <div>
        <Alert stack={{limit: 3}} position='top' />
        <Confirm title="Create New Application" show={showModal} loading={loading} onCancel={this.onCancel.bind(this)} onConfirm={this.onConfirm}>
        <div className="user">
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
};
