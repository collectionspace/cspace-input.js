import React, { PropTypes } from 'react';
import CompoundInput from './CompoundInput';
import { normalizeLabel } from './Label';
import InputRow from './InputRow';
import LabelRow from './LabelRow';
import labelable from '../enhancers/labelable';

function extractInputs(children) {
  const inputs = [];

  React.Children.forEach(children, (child) => {
    if (child.type.isInput) {
      inputs.push(child);
    } else {
      Array.prototype.push.apply(inputs, extractInputs(child.props.children));
    }
  });

  return inputs;
}

function TabularCompoundInput(props) {
  const {
    children,
    repeating,
    ...remainingProps,
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
    <CompoundInput
      label={labelRow}
      repeating={repeating}
      {...remainingProps}
    >
      <InputRow embedded={repeating}>
        {modifiedInputs}
      </InputRow>
    </CompoundInput>
  );
}

TabularCompoundInput.propTypes = {
  children: PropTypes.node,
  repeating: PropTypes.bool,
};

TabularCompoundInput.isInput = true;

export default labelable(TabularCompoundInput);
