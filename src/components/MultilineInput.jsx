import React from 'react';
import enhanced from '../enhancers/enhanced';
import styles from '../../styles/cspace-input/MultilineInput.css';

/**
 * A text input that accepts and is able to display multiple lines of text. This component takes up
 * more screen space when rendered than LineInput.
 */
const MultilineInput = props => (
  <textarea
    className={styles.common}
    {...props}
  />
);

export default enhanced(MultilineInput);
