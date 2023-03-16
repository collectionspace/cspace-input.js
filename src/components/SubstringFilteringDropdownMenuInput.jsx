import React, { Component } from 'react';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import { filterOptionsBySubstring } from '../helpers/optionHelpers';

// TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
// Until then, propTypes need to be hoisted from the base component.
// eslint-disable-next-line react/forbid-foreign-prop-types
const { propTypes } = FilteringDropdownMenuInput;

export default class SubstringFilteringDropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.filter = this.filter.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);

    const substring = null;

    this.state = {
      substring,
      filteredOptions: filterOptionsBySubstring(props.options, substring),
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
      filteredOptions: filterOptionsBySubstring(options, prevState.substring),
    }));
  }

  handleDropdownInputCommit(path, value) {
    const {
      options,
      onCommit,
    } = this.props;

    const substring = null;

    this.setState({
      substring,
      value,
      filteredOptions: filterOptionsBySubstring(options, substring),
    });

    if (onCommit) {
      onCommit(path, value);
    }
  }

  filter(substring) {
    const {
      options,
    } = this.props;

    this.setState({
      substring,
      filteredOptions: filterOptionsBySubstring(options, substring),
    });
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

SubstringFilteringDropdownMenuInput.propTypes = propTypes;
