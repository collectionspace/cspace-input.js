import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/MiniButton.css';

const propTypes = {
  className: PropTypes.string,
};

/**
 * A small button attached to an input.
 */
export default function MiniButton(props) {
  const {
    className,
  } = props;

  const classes = classNames(styles.common, className);

  return (
    <button
      {...props}
      className={classes}
      type="button"
    />
  );
}

MiniButton.propTypes = propTypes;
