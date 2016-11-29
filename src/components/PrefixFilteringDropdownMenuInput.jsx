import React, { Component } from 'react';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import { filterOptionsByPrefix } from '../helpers/optionHelpers';

const propTypes = FilteringDropdownMenuInput.propTypes;

export default class PrefixFilteringDropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.filter = this.filter.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);

    const prefix = null;

    this.state = {
      prefix,
      filteredOptions: filterOptionsByPrefix(props.options, prefix),
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filteredOptions: filterOptionsByPrefix(nextProps.options, this.state.prefix),
      value: nextProps.value,
    });
  }

  filter(prefix) {
    this.setState({
      prefix,
      filteredOptions: filterOptionsByPrefix(this.props.options, prefix),
    });
  }

  handleDropdownInputCommit(path, value) {
    const prefix = null;

    this.setState({
      prefix,
      value,
      filteredOptions: filterOptionsByPrefix(this.props.options, prefix),
    });

    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(path, value);
    }
  }

  render() {
    const {
      /* eslint-disable no-unused-vars */
      options,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      filteredOptions,
      value,
    } = this.state;

    return (
      <FilteringDropdownMenuInput
        {...remainingProps}
        filter={this.filter}
        options={filteredOptions}
        value={value}
        onCommit={this.handleDropdownInputCommit}
      />
    );
  }
}

PrefixFilteringDropdownMenuInput.propTypes = propTypes;
