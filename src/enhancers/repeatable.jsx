import React from 'react';
import PropTypes from 'prop-types';
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
    // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
    // Until then, propTypes need to be hoisted from the base component.
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...BaseComponent.propTypes,
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...RepeatingInput.propTypes,
    repeating: PropTypes.bool,
  };

  const defaultProps = {
    repeating: false,
  };

  function Repeatable(props) {
    const {
      repeating,
      reorderable,
      renderOrderIndicator,
      disableRemoveButton,
      onAddInstance,
      onMoveInstance,
      onRemoveInstance,
      ...remainingProps
    } = props;

    if (!repeating) {
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <BaseComponent {...remainingProps} />
      );
    }

    const {
      name,
      parentPath,
      subpath,
      value,
      asText,
      readOnly,
      onCommit,
      ...baseProps
    } = remainingProps;

    return (
      <RepeatingInput
        name={name}
        parentPath={parentPath}
        subpath={subpath}
        value={value}
        asText={asText}
        readOnly={readOnly}
        reorderable={reorderable}
        disableRemoveButton={disableRemoveButton}
        renderOrderIndicator={renderOrderIndicator}
        onAddInstance={onAddInstance}
        onCommit={onCommit}
        onMoveInstance={onMoveInstance}
        onRemoveInstance={onRemoveInstance}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <BaseComponent {...baseProps} />
      </RepeatingInput>
    );
  }

  Repeatable.propTypes = propTypes;
  Repeatable.defaultProps = defaultProps;
  Repeatable.displayName = `repeatable(${baseComponentName})`;

  return Repeatable;
}
