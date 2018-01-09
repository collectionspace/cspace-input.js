import React, { Component } from 'react';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import { filterOptionsBySubstring } from '../helpers/optionHelpers';

const propTypes = FilteringDropdownMenuInput.propTypes;

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
    this.setState({
      filteredOptions: filterOptionsBySubstring(nextProps.options, this.state.substring),
      value: nextProps.value,
    });
  }

  filter(substring) {
    this.setState({
      substring,
      filteredOptions: filterOptionsBySubstring(this.props.options, substring),
    });
  }

  handleDropdownInputCommit(path, value) {
    const substring = null;

    this.setState({
      substring,
      value,
      filteredOptions: filterOptionsBySubstring(this.props.options, substring),
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

SubstringFilteringDropdownMenuInput.propTypes = propTypes;
