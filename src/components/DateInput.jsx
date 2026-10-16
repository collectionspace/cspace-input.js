import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import { normalizeDateString } from '../helpers/dateHelpers';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/LineInput.css';

const propTypes = {
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  locale: PropTypes.string,
  onCommit: PropTypes.func,
  asText: PropTypes.bool,
  readOnly: PropTypes.bool,
  embedded: PropTypes.bool,
};

const defaultProps = {
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  locale: 'en-US',
  onCommit: undefined,
  asText: undefined,
  readOnly: undefined,
  embedded: undefined,
};

export default function DateInput(props) {
  const {
    value,
    name,
    onCommit,
    asText,
    embedded,
    locale,
    readOnly,
    parentPath,
    subpath,
    ...remainingProps
  } = props;

  const handleChange = (event) => {
    const eventValue = event.target.value;

    const initialValue = normalizeDateString(value, locale) || '';
    if (onCommit && eventValue !== initialValue) {
      onCommit(getPath(props), eventValue);
    }
  };

  const className = embedded ? styles.embedded : styles.normal;
  const normalizedValue = normalizeDateString(value, locale) || '';
  if (asText || readOnly) {
    const {
      id,
    } = remainingProps;

    return (
      <LineInput
        id={id}
        asText={asText}
        value={normalizedValue}
        embedded={embedded}
        readOnly={readOnly}
      />
    );
  }

  return (
    <input
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
      type="date"
      data-name={name}
      className={className}
      value={normalizedValue}
      onChange={handleChange}
    />
  );
}

DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;
