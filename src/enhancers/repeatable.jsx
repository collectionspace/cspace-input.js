import React, { PropTypes } from 'react';
import RepeatingInput from '../components/RepeatingInput';

/**
 * Makes an input component possibly repeating. Returns an enhanced component that accepts a
 * repeating prop. If true, the base  component is wrapped in a RepeatingInput; otherwise, the
 * base component is returned unchanged.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function repeatable(BaseComponent) {
  const Repeatable = (props) => {
    const {
      repeating,
      value,
      ...remainingProps,
    } = props;

    if (!repeating) {
      return (
        <BaseComponent value={value} {...remainingProps} />
      );
    }

    return (
      <RepeatingInput value={value}>
        <BaseComponent {...remainingProps} />
      </RepeatingInput>
    );
  };

  Repeatable.propTypes = {
    repeating: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ])),
    ]),
  };

  Repeatable.defaultProps = {
    repeating: false,
  };

  return Repeatable;
}
