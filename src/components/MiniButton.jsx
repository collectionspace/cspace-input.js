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

const defaultProps = {
  autoWidth: undefined,
  className: undefined,
  readOnly: undefined,
  children: undefined,
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
    const {
      children,
    } = props;

    return (
      <div className={classes}>
        {children}
      </div>
    );
  }

  return (
    <button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
      className={classes}
      type="button"
    />
  );
}

MiniButton.propTypes = propTypes;
MiniButton.defaultProps = defaultProps;
