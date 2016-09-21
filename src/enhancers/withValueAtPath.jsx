import React, { PropTypes } from 'react';

/**
 * Returns an enhanced component that accepts a path prop. T
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component, which accepts a name prop and a path prop.
 */
export default function withValueAtPath(BaseComponent) {
  const WithValueAtPath = (props) => {
    const {
      path, // eslint-disable-line no-unused-vars
      ...remainingProps,
    } = props;

    return (
      <BaseComponent
        {...remainingProps}
      />
    );
  };

  WithValueAtPath.propTypes = {
    path: PropTypes.string,
  };

  WithValueAtPath.isInput = BaseComponent.isInput;

  return WithValueAtPath;
}
