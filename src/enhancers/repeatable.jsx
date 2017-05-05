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
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    ...RepeatingInput.propTypes,
    repeating: PropTypes.bool,
  };

  function Repeatable(props) {
    const {
      repeating,
      reorderable,
      onAddInstance,
      onMoveInstance,
      onRemoveInstance,
      ...remainingProps
    } = props;

    if (!repeating) {
      return (
        <BaseComponent {...remainingProps} />
      );
    }

    const {
      name,
      parentPath,
      subpath,
      value,
      onCommit,
      ...baseProps
    } = remainingProps;

    return (
      <RepeatingInput
        name={name}
        parentPath={parentPath}
        subpath={subpath}
        value={value}
        reorderable={reorderable}
        onAddInstance={onAddInstance}
        onCommit={onCommit}
        onMoveInstance={onMoveInstance}
        onRemoveInstance={onRemoveInstance}
      >
        <BaseComponent {...baseProps} />
      </RepeatingInput>
    );
  }

  Repeatable.propTypes = propTypes;
  Repeatable.displayName = `repeatable(${baseComponentName})`;

  return Repeatable;
}
