import React, { PropTypes } from 'react';

/**
 * Returns an enhanced component that accepts a subpath prop.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component, which accepts a subpath prop.
 */
export default function withSubpath(BaseComponent) {
  const WithSubpath = (props) => {
    const {
      subpath, // eslint-disable-line no-unused-vars
      ...remainingProps
    } = props;

    return (
      <BaseComponent
        {...remainingProps}
      />
    );
  };

  WithSubpath.propTypes = {
    ...BaseComponent.propTypes,
    subpath: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  };

  return WithSubpath;
}
