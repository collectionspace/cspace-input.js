import React, { PropTypes } from 'react';
import CustomCompoundInput from './CustomCompoundInput';
import TabularCompoundInput from './TabularCompoundInput';

export default function CompoundInput(props) {
  const {
    tabular,
    ...remainingProps
  } = props;

  const Component = tabular ? TabularCompoundInput : CustomCompoundInput;

  return (
    <Component {...remainingProps} />
  );
}

CompoundInput.propTypes = {
  ...CustomCompoundInput.propTypes,
  ...TabularCompoundInput.propTypes,
  tabular: PropTypes.bool,
};

CompoundInput.defaultProps = {
  tabular: false,
};
