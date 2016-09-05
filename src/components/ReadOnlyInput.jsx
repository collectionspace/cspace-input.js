import React from 'react';
import styles from '../../styles/cspace-input/ReadOnlyInput.css';

/**
 * An input that displays a value, but does not allow it to be edited.
 */
export default function ReadOnlyInput(props) {
  const {
    value,
  } = props;

  // Preservation of whitespace is a functional requirement of this component,
  // so this style is attached to the DOM to prevent it from being overridden.

  const style = {
    whiteSpace: 'pre',
  };

  return (
    <div
      className={styles.common}
      style={style}
    >
      {value}
    </div>
  );
}

ReadOnlyInput.propTypes = {
  /**
   * The value.
   */
  value: React.PropTypes.string,
};

ReadOnlyInput.defaultProps = {
  value: '',
};
