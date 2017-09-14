import React from 'react';
import PropTypes from 'prop-types';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/ReadOnlyInput.css';

const propTypes = {
  name: PropTypes.string,
  parentPath: pathPropType, // eslint-disable-line react/no-unused-prop-types
  subpath: pathPropType,    // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.string,
  formatValue: PropTypes.func,
};

// Preservation of whitespace is a functional requirement of this component, so this style is
// attached to the DOM to prevent it from being overridden.

const preserveWhiteSpace = {
  whiteSpace: 'pre',
};

/**
 * An input that displays a value, but does not allow it to be edited.
 */
export default function ReadOnlyInput(props) {
  const {
    name,
    value,
    formatValue,
  } = props;

  return (
    <div
      className={styles.common}
      data-name={name}
      style={preserveWhiteSpace}
    >
      {formatValue ? formatValue(value) : value}
    </div>
  );
}

ReadOnlyInput.propTypes = propTypes;
