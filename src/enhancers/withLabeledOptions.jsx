import React from 'react';
import PropTypes from 'prop-types';

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
    // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
    // Until then, propTypes need to be hoisted from the base component.
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...BaseComponent.propTypes,
    formatOptionLabel: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
  };

  const defaultProps = {
    formatOptionLabel: (option) => (
      typeof option.label === 'undefined' ? option.value : option.label
    ),
    options: [],
  };

  function WithLabeledOptions(props) {
    const {
      formatOptionLabel,
      options,
      ...remainingProps
    } = props;

    const labeledOptions = options.map((option) => ({
      ...option,
      label: formatOptionLabel(option),
    }));

    return (
      <BaseComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
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
