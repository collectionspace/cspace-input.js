import React, { PropTypes } from 'react';
import { normalizeLabel } from '../components/Label';

/**
 * Makes an input component labelable. Returns an enhanced component that accepts a label prop. If
 * a label is supplied, the base component is wrapped, and rendered in the wrapper along with the
 * label. If the label is a string, it is wrapped in a Label; otherwise, it is rendered as given.
 * If no label is supplied, the base component is returned unchanged.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function repeatable(BaseComponent) {
  const Labelable = (props) => {
    const {
      label,
      ...remainingProps,
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
  };

  Labelable.propTypes = {
    label: PropTypes.node,
  };

  Labelable.isInput = BaseComponent.isInput;

  return Labelable;
}
