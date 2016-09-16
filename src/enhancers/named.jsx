import React, { PropTypes } from 'react';

/**
 * Returns an enhanced component that accepts name and path props.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component, which accepts a name prop and a path prop.
 */
export default function named(BaseComponent) {
  const Named = (props) => {
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

  Named.propTypes = {
    name: PropTypes.string,
    path: PropTypes.string,
  };

  return Named;
}
