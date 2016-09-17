import React from 'react';
import styles from '../../styles/cspace-input/MiniButton.css';

/**
 * A small button attached to an input.
 */
export default props => (
  <button
    className={styles.common}
    type="button"
    {...props}
  />
);
