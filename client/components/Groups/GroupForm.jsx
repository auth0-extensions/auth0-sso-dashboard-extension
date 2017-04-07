import React, { PropTypes, Component } from 'react';
import { InputText, Error } from '../Dashboard';
import createForm from '../../utils/createForm';

export default createForm('group', class extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    group: PropTypes.object.isRequired,
    fields: React.PropTypes.object
  }

  static formFields = [
    'name'
  ];

  render() {
    if (this.props.loading) {
      return <div />;
    }
    const { fields } = this.props;

    return (<div>
      <div className="row">
        <div className="col-xs-12 wrapper">
          <Error message={this.props.error} />
        </div>
      </div>
      <form className="appForm updateAppForm">
        <InputText
          field={fields.name} fieldName="name" label="Name" ref="name"
          placeholder="insert a name for users to see"
        />
      </form>
    </div>);
  }
});
