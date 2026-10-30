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
    readOnly,
    parentPath,
    subpath,
    ...remainingProps
  } = props;

  const className = embedded ? styles.embedded : styles.normal;
  if (asText || readOnly) {
    const {
      id,
    } = remainingProps;

    return (
      <LineInput
        id={id}
        asText={asText}
        value={value}
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
      value={value}
    />
  );
}

BaseDateInput.propTypes = propTypes;
BaseDateInput.defaultProps = defaultProps;

const EnhancedDateInput = committable(changeable(BaseDateInput));

const wrapperPropTypes = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...EnhancedDateInput.propTypes,
  locale: PropTypes.string,
};

const wrapperDefaultProps = {
  ...EnhancedDateInput.defaultProps,
  locale: 'en-US',
};

/**
 * A date input, rendered using the browser's native date input. The value is normalized before it
 * is passed to the changeable/committable enhancers, so that the value held while editing is never
 * re-normalized
 */
export default function DateInput(props) {
  const {
    locale,
    value,
    ...remainingProps
  } = props;

  return (
    <EnhancedDateInput
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
      value={normalizeDateString(value, locale) || ''}
    />
  );
}

DateInput.propTypes = wrapperPropTypes;
DateInput.defaultProps = wrapperDefaultProps;
