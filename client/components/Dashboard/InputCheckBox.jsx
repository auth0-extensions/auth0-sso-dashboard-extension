import React, { Component } from 'react';
import classNames from 'classnames';

class InputCheckBox extends Component {
  render() {
    const { label, field, fieldName, validationErrors, defaultChecked } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length
    });

    return <div className={classes}>
      <label>{label}</label>
      <input type="checkbox" {...field} />
      { validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length && <div className="help-block">{ validationErrors[fieldName][0] }</div> }
    </div>;
  }
}

InputCheckBox.propTypes = {
  field: React.PropTypes.object.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default InputCheckBox;
