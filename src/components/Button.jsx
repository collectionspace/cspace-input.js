import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/Button.css';

const propTypes = {
  className: PropTypes.string,
  icon: PropTypes.bool,
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
    className,
    icon,
    type,
    ...remainingProps
  } = props;

  const classes = classNames(icon ? styles.icon : styles.common, className);

  return (
    <button
      className={classes}
      type={type}
      {...remainingProps}
    />
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
