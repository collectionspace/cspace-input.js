import React, { PropTypes } from 'react';
import CustomCompoundInput from './CustomCompoundInput';
import InputRow from './InputRow';
import LabelRow from './LabelRow';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import isInput from '../helpers/isInput';
import normalizeLabel from '../helpers/normalizeLabel';

const BaseComponent = repeatable(labelable(CustomCompoundInput));

const propTypes = {
  ...BaseComponent.propTypes,
  children: PropTypes.node,
  repeating: PropTypes.bool,
};

function extractInputs(children) {
  const inputs = [];

  React.Children.forEach(children, (child) => {
    if (isInput(child)) {
      inputs.push(child);
    } else {
      Array.prototype.push.apply(inputs, extractInputs(child.props.children));
    }
  });

  return inputs;
}

export default function TabularCompoundInput(props) {
  const {
    children,
    repeating,
    ...remainingProps
  } = props;

  const inputs = extractInputs(children);

  const modifiedLabels = inputs.map((input) => {
    const normalizedLabel = normalizeLabel(input.props.label);

    if (!normalizedLabel) {
      return null;
    }

    return React.cloneElement(normalizedLabel, {
      key: input.props.name,
    });
  });

  const modifiedInputs = inputs.map(input => React.cloneElement(input, {
    key: input.props.name,
    label: undefined,
    embedded: true,
  }));

  let labelRow = null;

  if (modifiedLabels.some(label => !!label)) {
    labelRow = (
      <LabelRow embedded={repeating}>
        {modifiedLabels}
      </LabelRow>
    );
  }

  return (
    <BaseComponent
      {...remainingProps}
      label={labelRow}
      repeating={repeating}
    >
      <InputRow embedded={repeating}>
        {modifiedInputs}
      </InputRow>
    </BaseComponent>
  );
}

TabularCompoundInput.propTypes = propTypes;
