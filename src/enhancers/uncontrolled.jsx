import React, { PropTypes } from 'react';

/**
 * Makes an input component uncontrolled. Returns an enhanced component that accepts a value prop,
 * and passes the value to the base component as its defaultValue.
 * @see {@link //https://facebook.github.io/react/docs/forms.html#uncontrolled-components}
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function uncontrolled(BaseComponent) {
  const Uncontrolled = (props) => {
    const {
      value,
      ...remainingProps,
    } = props;

    return (
      <BaseComponent
        defaultValue={value}
        {...remainingProps}
      />
    );
  };

  Uncontrolled.propTypes = {
    ...BaseComponent.propTypes,
    value: PropTypes.string,
  };

  return Uncontrolled;
}
