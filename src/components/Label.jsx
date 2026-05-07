import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/cspace-input/Label.css';

const propTypes = {
  children: PropTypes.node,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  htmlFor: PropTypes.string,
  id: PropTypes.string,
};

const defaultProps = {
  children: undefined,
  readOnly: undefined,
  required: undefined,
  htmlFor: undefined,
  id: undefined,
};

/**
 * A label for an input.
 */
export default function Label(props) {
  const {
    children,
    readOnly,
    required,
    htmlFor,
    id,
  } = props;

  const className = (required && !readOnly) ? styles.required : styles.common;

  return (
    <label className={className} htmlFor={htmlFor} id={id}>
      {children}
    </label>
  );
}

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;
