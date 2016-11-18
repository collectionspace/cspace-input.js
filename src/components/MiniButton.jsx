import React from 'react';
import styles from '../../styles/cspace-input/MiniButton.css';

/**
 * A small button attached to an input.
 */
export default function MiniButton(props) {
  return (
    <button
      {...props}
      className={styles.common}
      type="button"
    />
  );
}
