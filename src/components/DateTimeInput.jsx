import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import { pathPropType } from '../helpers/pathHelpers';

/*
 * This is currently a read-only input.
 */

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  // TODO: Stop using propTypes in isInput. Until then, these unused props need to be declared so
  // this component is recognized as an input.
  /* eslint-disable react/no-unused-prop-types */
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  value: PropTypes.string,
  formatValue: PropTypes.func,
};

const defaultProps = {
  id: undefined,
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  formatValue: undefined,
};

export default function DateTimeInput(props) {
  const {
    id,
    name,
    value,
    formatValue,
  } = props;

  return (
    <LineInput
      id={id}
      name={name}
      readOnly
      value={formatValue ? formatValue(value) : value}
    />
  );
}

DateTimeInput.propTypes = propTypes;
DateTimeInput.defaultProps = defaultProps;
