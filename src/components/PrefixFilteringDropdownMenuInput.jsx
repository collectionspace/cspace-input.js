import React, { Component } from 'react';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import { filterOptionsByPrefix } from '../helpers/optionHelpers';

// TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
// Until then, propTypes need to be hoisted from the base component.
// eslint-disable-next-line react/forbid-foreign-prop-types
const { propTypes } = FilteringDropdownMenuInput;

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
    const {
      options,
      value,
    } = nextProps;

    this.setState((prevState) => ({
      value,
      filteredOptions: filterOptionsByPrefix(options, prevState.prefix),
    }));
  }

  filter(prefix) {
    const {
      options,
    } = this.props;

    this.setState({
      prefix,
      filteredOptions: filterOptionsByPrefix(options, prefix),
    });
  }

  handleDropdownInputCommit(path, value) {
    const {
      options,
      onCommit,
    } = this.props;

    const prefix = null;

    this.setState({
      prefix,
      value,
      filteredOptions: filterOptionsByPrefix(options, prefix),
    });

    if (onCommit) {
      onCommit(path, value);
    }
  }

  render() {
    const {
      options,
      ...remainingProps
    } = this.props;

    const {
      filteredOptions,
      value,
    } = this.state;

    return (
      <FilteringDropdownMenuInput
        // eslint-disable-next-line react/jsx-props-no-spreading
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
