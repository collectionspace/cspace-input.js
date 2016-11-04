import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/Button.css';

/**
 * A button.
 */
export default function Button(props) {
  const {
    type,
    ...remainingProps
  } = props;

  return (
    <button
      className={styles.common}
      type={type}
      {...remainingProps}
    />
  );
}

Button.propTypes = {
  type: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
};
