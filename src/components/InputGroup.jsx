import React, { PropTypes } from 'react';
import CustomCompoundInput from './CustomCompoundInput';
import TabularCompoundInput from './TabularCompoundInput';

export default function InputGroup(props) {
  const {
    tabular,
    ...remainingProps,
  } = props;

  const Component = tabular ? TabularCompoundInput : CustomCompoundInput;

  return (
    <Component {...remainingProps} />
  );
}

InputGroup.propTypes = {
  ...CustomCompoundInput.propTypes,
  ...TabularCompoundInput.propTypes,
  tabular: PropTypes.bool,
};

InputGroup.defaultProps = {
  tabular: false,
};
