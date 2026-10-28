import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import { normalizeDateString } from '../helpers/dateHelpers';
import { pathPropType } from '../helpers/pathHelpers';
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

function BaseDateInput(props) {
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
    />
  );
}

BaseDateInput.propTypes = propTypes;
BaseDateInput.defaultProps = defaultProps;

export default committable(changeable(BaseDateInput));
