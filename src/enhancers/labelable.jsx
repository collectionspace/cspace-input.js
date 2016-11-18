import React, { PropTypes } from 'react';
import normalizeLabel from '../helpers/normalizeLabel';

/**
 * Makes an input component labelable. Returns an enhanced component that accepts a label prop. If
 * a label is supplied, the base component is wrapped, and rendered in the wrapper along with the
 * label. If the label is a string, it is wrapped in a Label; otherwise, it is rendered as given.
 * If no label is supplied, the base component is returned unchanged. A msgkey prop is also
 * accepted, but has no effect. It may be used by preprocessors to generate a label.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function labelable(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    label: PropTypes.node,
    msgkey: PropTypes.string,
  };

  const contextTypes = BaseComponent.contextTypes;

  function Labelable(props) {
    const {
      label,
      msgkey, // eslint-disable-line no-unused-vars
      ...remainingProps
    } = props;

    const normalizedLabel = normalizeLabel(label);

    const baseComponent = (
      <BaseComponent {...remainingProps} />
    );

    if (!normalizedLabel) {
      return baseComponent;
    }

    return (
      <div>
        {normalizedLabel}
        {baseComponent}
      </div>
    );
  }

  Labelable.propTypes = propTypes;
  Labelable.contextTypes = contextTypes;
  Labelable.displayName = `labelable(${baseComponentName})`;

  return Labelable;
}
