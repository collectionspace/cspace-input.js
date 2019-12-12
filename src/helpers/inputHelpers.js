import React from 'react';

export const isInput = (component) => {
  if (!component) {
    return false;
  }

  const { type } = component;

  if (!type) {
    return false;
  }

  // TODO: Stop looking at propTypes to determine if a component is a cspace-input input, so that
  // propTypes may be removed in production builds. Use a property on the function/class instead.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  const { propTypes } = type;

  if (!propTypes) {
    return false;
  }

  return (
    'name' in propTypes
    && 'value' in propTypes
    && 'parentPath' in propTypes
    && 'subpath' in propTypes
  );
};

export const extractInputs = (children) => {
  const inputs = [];

  React.Children.forEach(children, (child) => {
    if (isInput(child)) {
      inputs.push(child);
    } else {
      Array.prototype.push.apply(inputs, extractInputs(child.props.children));
    }
  });

  return inputs;
};
