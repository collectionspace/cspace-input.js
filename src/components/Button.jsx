import React from 'react';
import styles from '../../styles/cspace-input/Button.css';

/**
 * A button.
 */
export default function Button(props) {
  return (
    <button
      className={styles.common}
      {...props}
    />
  );
}
