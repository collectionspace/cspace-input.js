import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/MiniButton.css';

const propTypes = {
  autoWidth: PropTypes.bool,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * A small button attached to an input.
 */
export default function MiniButton(props) {
  const {
    autoWidth,
    className,
    readOnly,
    ...remainingProps
  } = props;

  const classes = classNames(autoWidth ? styles.autoWidth : styles.normal, className);

  if (readOnly) {
    return (
      <div className={classes}>
        {props.children}
      </div>
    );
  }

  return (
    <button
      {...remainingProps}
      className={classes}
      type="button"
    />
  );
}

MiniButton.propTypes = propTypes;
