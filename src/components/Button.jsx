import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/Button.css';

const propTypes = {
  type: PropTypes.string,
};

const defaultProps = {
  type: 'button',
};

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

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
