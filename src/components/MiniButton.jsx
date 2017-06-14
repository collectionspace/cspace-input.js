import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/MiniButton.css';

const propTypes = {
  autoWidth: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * A small button attached to an input.
 */
export default function MiniButton(props) {
  const {
    autoWidth,
    className,
    ...remainingProps
  } = props;

  const classes = classNames(autoWidth ? styles.autoWidth : styles.normal, className);

  return (
    <button
      {...remainingProps}
      className={classes}
      type="button"
    />
  );
}

MiniButton.propTypes = propTypes;
