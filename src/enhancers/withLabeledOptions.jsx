import React, { PropTypes } from 'react';
import { normalizeOptions } from '../helpers/optionHelpers';

/**
 * Sets labels on options using a formatting function before passing them on to the base
 * component.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function withLabeledOptions(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    formatOptionLabel: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
  };

  const defaultProps = {
    formatOptionLabel: option => (typeof option.label === 'undefined' ? option.value : option.label),
    options: [],
  };

  function WithLabeledOptions(props) {
    const {
      formatOptionLabel,
      options,
      ...remainingProps
    } = props;

    const labeledOptions = options.map(option => Object.assign({}, option, {
      label: formatOptionLabel(option),
    }));

    return (
      <BaseComponent
        {...remainingProps}
        options={labeledOptions}
      />
    );
  }

  WithLabeledOptions.propTypes = propTypes;
  WithLabeledOptions.defaultProps = defaultProps;
  WithLabeledOptions.displayName = `withLabeledOptions(${baseComponentName})`;

  return WithLabeledOptions;
}
