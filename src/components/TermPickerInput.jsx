import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'cspace-refname';
import SubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import withNormalizedOptions from '../enhancers/withNormalizedOptions';

const BaseDropdownMenuInput = withNormalizedOptions(SubstringFilteringDropdownMenuInput);

const propTypes = {
  ...SubstringFilteringDropdownMenuInput.propTypes,
  terms: PropTypes.arrayOf(PropTypes.shape({
    refName: PropTypes.string,
    displayName: PropTypes.string,
  })),
  onMount: PropTypes.func,
};

export default class TermPickerInput extends Component {
  componentDidMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  render() {
    const {
      terms,
      value,
      /* eslint-disable no-unused-vars */
      onMount,
      /* eslint-disable no-unused-vars */
      ...remainingProps
    } = this.props;

    let options;

    if (terms) {
      options = terms.map((term) => {
        const option = {
          value: term.refName,
          label: term.displayName,
        };

        if (term.termStatus === 'inactive') {
          option.disabled = true;
        }

        return option;
      });
    } else {
      options = [];
    }

    return (
      <BaseDropdownMenuInput
        options={options}
        value={value}
        valueLabel={getDisplayName(value)}
        {...remainingProps}
      />
    );
  }
}

TermPickerInput.propTypes = propTypes;
