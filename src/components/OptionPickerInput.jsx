import React from 'react';
import PropTypes from 'prop-types';
import SubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import PrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';
import withNormalizedOptions from '../enhancers/withNormalizedOptions';

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...SubstringFilteringDropdownMenuInput.propTypes,
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...PrefixFilteringDropdownMenuInput.propTypes,
  filter: PropTypes.string,
};

const defaultProps = {
  filter: 'substring', // or 'prefix'
};

const BaseSubstringFilteringDropdownMenuInput = withLabeledOptions(
  withNormalizedOptions(SubstringFilteringDropdownMenuInput),
);

const BasePrefixFilteringDropdownMenuInput = withLabeledOptions(
  withNormalizedOptions(PrefixFilteringDropdownMenuInput),
);

export default function OptionPickerInput(props) {
  const {
    filter,
    ...remainingProps
  } = props;

  const BaseDropdownMenuInput = (filter === 'prefix')
    ? BasePrefixFilteringDropdownMenuInput
    : BaseSubstringFilteringDropdownMenuInput;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BaseDropdownMenuInput {...remainingProps} />
  );
}

OptionPickerInput.propTypes = propTypes;
OptionPickerInput.defaultProps = defaultProps;
