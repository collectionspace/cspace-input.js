import React from 'react';
import enhanced from '../enhancers/enhanced';
import styles from '../../styles/cspace-input/LineInput.css';

/**
 * A text input that accepts and is able to display only a single line of text. If a value prop is
 * supplied that contains a newline character, the behavior is unspecified; newline characters may
 * be stripped, replaced with other characters, or retained but not displayed. If this presents a
 * problem, use TextInput or MultilineInput.
 */
const PasswordInput = props => (
  <input
    className={styles.normal}
    type="password"
    {...props}
  />
);

PasswordInput.isInput = true;

export default enhanced(PasswordInput);
