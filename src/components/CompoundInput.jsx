import React, { PropTypes } from 'react';
import BaseCustomCompoundInput from './CustomCompoundInput';
import BaseTabularCompoundInput from './TabularCompoundInput';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';

const CustomCompoundInput = repeatable(labelable(BaseCustomCompoundInput));
const TabularCompoundInput = labelable(BaseTabularCompoundInput);

const propTypes = {
  ...TabularCompoundInput.propTypes,
  tabular: PropTypes.bool,
};

export default function CompoundInput(props) {
  const {
    tabular,
    ...remainingProps
  } = props;

  const BaseComponent = tabular ? TabularCompoundInput : CustomCompoundInput;

  return (
    <BaseComponent {...remainingProps} />
  );
}

CompoundInput.propTypes = propTypes;
