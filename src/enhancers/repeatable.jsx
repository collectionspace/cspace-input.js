import React, { PropTypes } from 'react';
import RepeatingInput, { propTypes as repeatingPropTypes } from '../components/RepeatingInput';

/**
 * Makes an input component possibly repeating. Returns an enhanced component that accepts a
 * repeating prop. If true, the base component is wrapped in a RepeatingInput; otherwise, the
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
    ...BaseComponent.propTypes,
    repeating: PropTypes.bool,
    value: repeatingPropTypes.value,
  };

  Repeatable.defaultProps = {
    repeating: false,
  };

  Repeatable.isInput = BaseComponent.isInput;

  return Repeatable;
}
