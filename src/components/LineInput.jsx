import React, { PropTypes } from 'react';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/LineInput.css';

const propTypes = {
  embedded: PropTypes.bool,
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
};

/**
 * A text input that accepts and is able to display only a single line of text. If a value prop is
 * supplied that contains a newline character, the behavior is unspecified; newline characters may
 * be stripped, replaced with other characters, or retained but not displayed. If this presents a
 * problem, use TextInput or MultilineInput.
 */
export default function LineInput(props) {
  const {
    embedded,
    name,
    value,
    /* eslint-disable no-unused-vars */
    parentPath,
    subpath,
    /* eslint-enable no-unused-vars */
    ...remainingProps
  } = props;

  const className = embedded ? styles.embedded : styles.normal;
  const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;
  const readOnly = !remainingProps.onChange;

  return (
    <input
      {...remainingProps}
      className={className}
      name={name}
      readOnly={readOnly}
      type="text"
      value={normalizedValue}
    />
  );
}

LineInput.propTypes = propTypes;
