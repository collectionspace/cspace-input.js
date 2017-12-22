import React from 'react';
import PropTypes from 'prop-types';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/LineInput.css';

const propTypes = {
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

const defaultProps = {
  value: '',
};

export default function PasswordInput(props) {
  const {
    name,
    readOnly,
    value,
    /* eslint-disable no-unused-vars */
    parentPath,
    subpath,
    /* eslint-enable no-unused-vars */
    ...remainingProps
  } = props;

  const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;

  return (
    <input
      {...remainingProps}
      className={styles.normal}
      disabled={readOnly}
      name={name}
      readOnly={!remainingProps.onChange}
      type="password"
      value={normalizedValue}
    />
  );
}

PasswordInput.propTypes = propTypes;
PasswordInput.defaultProps = defaultProps;
