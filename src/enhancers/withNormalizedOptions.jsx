import React, { PropTypes } from 'react';
import { normalizeOptions } from '../helpers/optionHelpers';

/**
 * Normalizes options before passing them on to the base component.
 * @param {string|function} BaseComponent - The component to enhance.
 * @returns {function} The enhanced component.
 */
export default function withNormalizedOptions(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    blankable: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
  };

  const defaultProps = {
    blankable: true,
  };

  function WithNormalizedOptions(props) {
    const {
      blankable,
      options,
      ...remainingProps
    } = props;

    const normalizedOptions = normalizeOptions(options, blankable);

    return (
      <BaseComponent
        {...remainingProps}
        options={normalizedOptions}
      />
    );
  }

  WithNormalizedOptions.propTypes = propTypes;
  WithNormalizedOptions.defaultProps = defaultProps;
  WithNormalizedOptions.displayName = `withNormalizedOptions(${baseComponentName})`;

  return WithNormalizedOptions;
}
