import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/LineInput.css';

const propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  value: '',
};

export default function PasswordInput(props) {
  const {
    name,
    value,
    ...remainingProps
  } = props;

  const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;
  const readOnly = !remainingProps.onChange;

  return (
    <input
      {...remainingProps}
      className={styles.normal}
      name={name}
      readOnly={readOnly}
      type="password"
      value={normalizedValue}
    />
  );
}

PasswordInput.propTypes = propTypes;
PasswordInput.defaultProps = defaultProps;
