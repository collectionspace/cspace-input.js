import React, { PropTypes } from 'react';
import RepeatingInput from '../components/RepeatingInput';

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
      name,
      repeating,
      subpath,
      value,
      onAddInstance,
      onCommit,
      onRemoveInstance,
      ...remainingProps,
    } = props;

    if (!repeating) {
      return (
        <BaseComponent
          name={name}
          subpath={subpath}
          value={value}
          onCommit={onCommit}
          {...remainingProps}
        />
      );
    }

    return (
      <RepeatingInput
        name={name}
        subpath={subpath}
        value={value}
        onAddInstance={onAddInstance}
        onCommit={onCommit}
        onRemoveInstance={onRemoveInstance}
      >
        <BaseComponent {...remainingProps} />
      </RepeatingInput>
    );
  };

  Repeatable.propTypes = {
    ...BaseComponent.propTypes,
    ...RepeatingInput.propTypes,
    repeating: PropTypes.bool,
  };

  Repeatable.defaultProps = {
    repeating: false,
  };

  return Repeatable;
}
