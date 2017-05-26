import React, { PropTypes, Component } from 'react';
import { InputText, Error } from 'auth0-extension-ui';
import { Field, reduxForm } from 'redux-form';


class GroupForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    group: PropTypes.object.isRequired
  }

  render() {
    if (this.props.loading) {
      return <div />;
    }

    return (<div>
      <div className="row">
        <div className="col-xs-12 wrapper">
          <Error message={this.props.error} />
        </div>
      </div>
      <form className="appForm updateAppForm">
        <Field
          component={InputText}
          name="name" label="Name"
          placeholder="Insert a name for users to see"
        />
      </form>
    </div>);
  }
}

const formName = 'group';
export default reduxForm({ form: formName })(GroupForm);