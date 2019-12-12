import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/cspace-input/Label.css';

const propTypes = {
  children: PropTypes.node,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};

const defaultProps = {
  children: undefined,
  readOnly: undefined,
  required: undefined,
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

  return (
    // FIXME: Set the htmlFor prop to associate the labeled control.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={className}>
      {children}
    </label>
  );
}

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;
