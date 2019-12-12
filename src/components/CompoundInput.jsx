import React from 'react';
import PropTypes from 'prop-types';
import BaseCustomCompoundInput from './CustomCompoundInput';
import BaseTabularCompoundInput from './TabularCompoundInput';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';

const CustomCompoundInput = repeatable(labelable(BaseCustomCompoundInput));
const TabularCompoundInput = labelable(BaseTabularCompoundInput);

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...TabularCompoundInput.propTypes,
  tabular: PropTypes.bool,
};

const defaultProps = {
  tabular: false,
};

export default function CompoundInput(props) {
  const {
    tabular,
    ...remainingProps
  } = props;

  const BaseComponent = tabular ? TabularCompoundInput : CustomCompoundInput;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BaseComponent {...remainingProps} />
  );
}

CompoundInput.propTypes = propTypes;
CompoundInput.defaultProps = defaultProps;
