import React, { PropTypes } from 'react';
import CustomCompoundInput from './CustomCompoundInput';
import InputTableRow from './InputTableRow';
import InputTableHeader from './InputTableHeader';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';

const BaseComponent = repeatable(labelable(CustomCompoundInput));

const propTypes = {
  ...BaseComponent.propTypes,
  children: PropTypes.node,
  repeating: PropTypes.bool,
  renderChildInputLabel: PropTypes.func,
};

export default function TabularCompoundInput(props) {
  const {
    children,
    repeating,
    renderChildInputLabel,
    ...remainingProps
  } = props;

  const tableHeader = (
    <InputTableHeader
      embedded={repeating}
      renderLabel={renderChildInputLabel}
    >
      {children}
    </InputTableHeader>
  );

  return (
    <BaseComponent
      {...remainingProps}
      label={tableHeader}
      repeating={repeating}
    >
      <InputTableRow embedded={repeating}>
        {children}
      </InputTableRow>
    </BaseComponent>
  );
}

TabularCompoundInput.propTypes = propTypes;
