import React from 'react';
import PropTypes from 'prop-types';
import normalizeLabel from '../helpers/normalizeLabel';
import Label from '../components/Label';

/**
 * Makes an input component labelable. Returns an enhanced component that accepts a label prop. If
 * a label is supplied, the base component is wrapped, and rendered in the wrapper along with the
 * label. If the label is a string, it is wrapped in a Label; otherwise, it is rendered as given.
 * If no label is supplied, the base component is returned unchanged. A msgkey prop is also
 * accepted, but has no effect. It may be used by preprocessors to generate a label.
 * If BaseComponent contains a static `useLegend = true` and the label is a Label element
 * (or a string that is normalized to one), the label is forwarded to BaseComponent as the
 *  `label` prop The BaseComponent is expected to render the label as a `<legend>`
 *  inside its own `<fieldset>`.
 *
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function labelable(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
    // Until then, propTypes need to be hoisted from the base component.
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...BaseComponent.propTypes,
    label: PropTypes.node,
    msgkey: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
  };

  const defaultProps = {
    label: undefined,
    msgkey: undefined,
    readOnly: undefined,
    required: false,
  };

  function Labelable(props) {
    const {
      label,
      // eslint-disable-next-line no-unused-vars
      msgkey,
      required,
      ...remainingProps
    } = props;

    const {
      readOnly,
      id,
    } = props;

    const labelId = id ? `${id}-label` : undefined;

    const normalizedLabel = normalizeLabel(label, {
      required,
      readOnly,
      htmlFor: id,
      id: labelId,
    });

    if (!normalizedLabel) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <BaseComponent {...remainingProps} />;
    }

    if (
      BaseComponent.useLegend
      && React.isValidElement(normalizedLabel)
      && normalizedLabel.type === Label
    ) {
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <BaseComponent {...remainingProps} label={normalizedLabel} />
      );
    }

    return (
      <div>
        {normalizedLabel}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <BaseComponent {...remainingProps} />
      </div>
    );
  }

  Labelable.propTypes = propTypes;
  Labelable.defaultProps = defaultProps;
  Labelable.displayName = `labelable(${baseComponentName})`;

  return Labelable;
}
