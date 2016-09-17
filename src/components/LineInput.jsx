import React, { PropTypes } from 'react';
import enhanced from '../enhancers/enhanced';
import styles from '../../styles/cspace-input/LineInput.css';

/**
 * A text input that accepts and is able to display only a single line of text. If a value prop is
 * supplied that contains a newline character, the behavior is unspecified; newline characters may
 * be stripped, replaced with other characters, or retained but not displayed. If this presents a
 * problem, use TextInput or MultilineInput.
 */
const LineInput = (props) => {
  const {
    embedded,
    ...remainingProps,
  } = props;

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <input
      className={className}
      type="text"
      {...remainingProps}
    />
  );
};

LineInput.propTypes = {
  embedded: PropTypes.bool,
};

LineInput.defaultProps = {
  embedded: false,
};

export default enhanced(LineInput);
