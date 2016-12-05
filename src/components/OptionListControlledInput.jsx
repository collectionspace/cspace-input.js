import React, { PropTypes } from 'react';
import PrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';

const propTypes = {
  ...PrefixFilteringDropdownMenuInput.propTypes,
  formatOptionLabel: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
  })),
};

const defaultProps = {
  formatOptionLabel: option => (typeof option.label === 'undefined' ? option.value : option.label),
  options: [],
};

export default function OptionListControlledInput(props) {
  const {
    formatOptionLabel,
    options,
    ...remainingProps
  } = props;

  const labeledOptions = options.map(option => Object.assign({}, option, {
    label: formatOptionLabel(option),
  }));

  return (
    <PrefixFilteringDropdownMenuInput
      {...remainingProps}
      options={labeledOptions}
    />
  );
}

OptionListControlledInput.propTypes = propTypes;
OptionListControlledInput.defaultProps = defaultProps;
