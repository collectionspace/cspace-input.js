import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/cspace-input/Label.css';

const propTypes = {
  children: PropTypes.node,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};

/**
 * A label for an input.
 */
export default function Label(props) {
  const {
    children,
    readOnly,
    required,
  } = props;

  const className = (required && !readOnly) ? styles.required : styles.common;

  // FIXME: Set the htmlFor prop to associate the labeled control.

  return (
    /* eslint-disable jsx-a11y/label-has-for */
    <label className={className}>
      {children}
    </label>
    /* eslint-enable jsx-a11y/label-has-for */
  );
}

Label.propTypes = propTypes;
