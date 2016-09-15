import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/ReadOnlyInput.css';

// Preservation of whitespace is a functional requirement of this component,
// so this style is attached to the DOM to prevent it from being overridden.

const preserveWhiteSpace = {
  whiteSpace: 'pre',
};

/**
 * An input that displays a value, but does not allow it to be edited.
 */
export default function ReadOnlyInput(props) {
  const {
    value,
  } = props;

  return (
    <div
      className={styles.common}
      style={preserveWhiteSpace}
    >
      {value}
    </div>
  );
}

ReadOnlyInput.propTypes = {
  value: PropTypes.string,
};
