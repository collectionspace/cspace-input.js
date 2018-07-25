import React from 'react';
import PropTypes from 'prop-types';
import SubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import PrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';
import withNormalizedOptions from '../enhancers/withNormalizedOptions';

const BaseSubstringFilteringDropdownMenuInput =
  withLabeledOptions(withNormalizedOptions(SubstringFilteringDropdownMenuInput));

const BasePrefixFilteringDropdownMenuInput =
  withLabeledOptions(withNormalizedOptions(PrefixFilteringDropdownMenuInput));

const propTypes = {
  ...SubstringFilteringDropdownMenuInput.propTypes,
  ...PrefixFilteringDropdownMenuInput.propTypes,
  filter: PropTypes.string,
};

const defaultProps = {
  filter: 'substring', // or 'prefix'
};

export default function OptionPickerInput(props) {
  const {
    filter,
    ...remainingProps
  } = props;

  const BaseDropdownMenuInput = (filter === 'prefix')
    ? BasePrefixFilteringDropdownMenuInput
    : BaseSubstringFilteringDropdownMenuInput;

  return (
    <BaseDropdownMenuInput {...remainingProps} />
  );
}

OptionPickerInput.propTypes = propTypes;
OptionPickerInput.defaultProps = defaultProps;
