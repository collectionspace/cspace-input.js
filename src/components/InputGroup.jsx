import React, { PropTypes } from 'react';
import CompoundInput from './CompoundInput';
import TabularCompoundInput from './TabularCompoundInput';

export default function InputGroup(props) {
  const {
    tabular,
    ...remainingProps,
  } = props;

  const Component = tabular ? TabularCompoundInput : CompoundInput;

  return (
    <Component {...remainingProps} />
  );
}

InputGroup.propTypes = {
  tabular: PropTypes.bool,
};

InputGroup.defaultProps = {
  tabular: false,
};

InputGroup.isInput = true;
