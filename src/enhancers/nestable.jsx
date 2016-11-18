import React, { PropTypes } from 'react';

/**
 * Enhances an input component so that it may be nested within another input component.
 * Returns an enhanced component that accepts a subpath prop, and defaultSubpath and parentPath
 * from context.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function nestable(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    subpath: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  };

  const contextTypes = {
    ...BaseComponent.contextTypes,
    defaultSubpath: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    parentPath: PropTypes.arrayOf(PropTypes.string),
  };

  function Nestable(props) {
    const {
      subpath, // eslint-disable-line no-unused-vars
      ...remainingProps
    } = props;

    return (
      <BaseComponent
        {...remainingProps}
      />
    );
  }

  Nestable.propTypes = propTypes;
  Nestable.contextTypes = contextTypes;
  Nestable.displayName = `nestable(${baseComponentName})`;

  return Nestable;
}
