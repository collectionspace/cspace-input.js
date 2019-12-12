import React from 'react';
import PropTypes from 'prop-types';
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
    // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
    // Until then, propTypes need to be hoisted from the base component.
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...BaseComponent.propTypes,
    blankable: PropTypes.bool,
    prefilter: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
    sortComparator: PropTypes.func,
  };

  const defaultProps = {
    blankable: true,
    options: undefined,
    prefilter: undefined,
    sortComparator: undefined,
  };

  function WithNormalizedOptions(props) {
    const {
      blankable,
      options,
      prefilter,
      sortComparator,
      ...remainingProps
    } = props;

    let normalizedOptions = normalizeOptions(options, blankable);

    if (prefilter) {
      normalizedOptions = normalizedOptions.filter(prefilter);
    }

    if (sortComparator) {
      normalizedOptions.sort(sortComparator);
    }

    return (
      <BaseComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
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
