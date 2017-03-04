import React from 'react';

export const isInput = (component) => {
  if (!component) {
    return false;
  }

  const type = component.type;

  if (!type) {
    return false;
  }

  const propTypes = type.propTypes;

  if (!propTypes) {
    return false;
  }

  return (
    'name' in propTypes &&
    'value' in propTypes &&
    'parentPath' in propTypes &&
    'subpath' in propTypes
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
