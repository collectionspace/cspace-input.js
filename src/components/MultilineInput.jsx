import React, { PropTypes } from 'react';
import { pathPropType } from '../helpers/pathHelpers';
import ReadOnlyInput from './ReadOnlyInput';
import styles from '../../styles/cspace-input/MultilineInput.css';

const propTypes = {
  embedded: PropTypes.bool,
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

/**
 * A text input that accepts and is able to display multiple lines of text. This component takes up
 * more screen space when rendered than LineInput.
 */
export default function MultilineInput(props) {
  const {
    embedded,
    value,
    readOnly,
    /* eslint-disable no-unused-vars */
    parentPath,
    subpath,
    /* eslint-enable no-unused-vars */
    ...remainingProps
  } = props;

  if (readOnly) {
    return (
      <ReadOnlyInput value={value} />
    );
  }

  const className = embedded ? styles.embedded : styles.normal;
  const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;

  return (
    <textarea
      {...remainingProps}
      className={className}
      readOnly={!remainingProps.onChange}
      value={normalizedValue}
    />
  );
}

MultilineInput.propTypes = propTypes;
