import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'cspace-refname';
import SubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import PrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withNormalizedOptions from '../enhancers/withNormalizedOptions';

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...SubstringFilteringDropdownMenuInput.propTypes,
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...PrefixFilteringDropdownMenuInput.propTypes,
  filter: PropTypes.string,
  terms: PropTypes.arrayOf(PropTypes.shape({
    refName: PropTypes.string,
    displayName: PropTypes.string,
  })),
  onMount: PropTypes.func,
};

const defaultProps = {
  filter: 'substring', // or 'prefix'
  terms: undefined,
  onMount: undefined,
};

const BaseSubstringFilteringDropdownMenuInput = withNormalizedOptions(
  SubstringFilteringDropdownMenuInput,
);

const BasePrefixFilteringDropdownMenuInput = withNormalizedOptions(
  PrefixFilteringDropdownMenuInput,
);

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
      filter,
      onMount,
      terms,
      ...remainingProps
    } = this.props;

    const {
      value,
    } = remainingProps;

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

    const BaseDropdownMenuInput = (filter === 'prefix')
      ? BasePrefixFilteringDropdownMenuInput
      : BaseSubstringFilteringDropdownMenuInput;

    return (
      <BaseDropdownMenuInput
        options={options}
        valueLabel={getDisplayName(value)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
      />
    );
  }
}

TermPickerInput.propTypes = propTypes;
TermPickerInput.defaultProps = defaultProps;
