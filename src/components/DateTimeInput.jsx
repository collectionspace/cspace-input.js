import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import { pathPropType } from '../helpers/pathHelpers';

/*
 * This is currently a read-only input.
 */

const propTypes = {
  name: PropTypes.string,
  parentPath: pathPropType, // eslint-disable-line react/no-unused-prop-types
  subpath: pathPropType,    // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.string,
  formatValue: PropTypes.func,
};

const defaultProps = {
  readOnly: true,
};

export default function DateTimeInput(props) {
  const {
    name,
    value,
    formatValue,
  } = props;

  return (
    <LineInput
      name={name}
      readOnly
      value={formatValue ? formatValue(value) : value}
    />
  );
}

DateTimeInput.propTypes = propTypes;
DateTimeInput.defaultProps = defaultProps;
