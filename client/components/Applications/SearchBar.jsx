import { findDOMNode } from 'react-dom';
import React, { PropTypes, Component } from 'react';

export default class SearchBar extends Component {
  static propTypes = {
    enabled: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onChangeSearch: PropTypes.func.isRequired
  }

  defaultProps = {
    enabled: true
  }

  onChangeSearch = (e) => {
    this.props.onChangeSearch(findDOMNode(this.refs.search).value);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="advanced-search-control">
            <span className="search-area">
              <i className="icon-budicon-489" />
              <input
                className="user-input search-input-apps" type="text" ref="search" placeholder="Search for apps"
                spellCheck="false" style={{ marginLeft: '10px' }} onChange={this.onChangeSearch}
              />
            </span>
            <span className="controls pull-right">
              <button onClick={this.props.onReset} type="reset" disabled={!this.props.enabled}>
                Reset <i className="icon-budicon-471" />
              </button>
            </span>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}
