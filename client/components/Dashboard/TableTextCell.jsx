import React, { PropTypes, Component } from 'react';
import TableCell from './TableCell';

export default class TableTextCell extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    clickArgs: PropTypes.array
  };

  static defaultProps = {
    clickArgs: []
  }

  clickCell = () => {
    this.props.onClick(...this.props.clickArgs);
  };

  render() {
    if (this.props.onClick) {
      return (
        <TableCell>
          <a href="#" onClick={this.clickCell} title={ this.props.children || '' }>
            { this.props.children || '' }
          </a>
        </TableCell>
      );
    }

    return <TableCell>
      <span title={ this.props.children || '' }>{ this.props.children || '' }</span>
    </TableCell>;
  }
}
