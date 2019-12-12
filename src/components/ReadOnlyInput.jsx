import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/ReadOnlyInput.css';

// Preservation of whitespace is a functional requirement of this component, so this style is
// attached to the DOM to prevent it from being overridden.

const preserveWhiteSpace = {
  whiteSpace: 'pre',
};

const propTypes = {
  name: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  value: PropTypes.string,
  embedded: PropTypes.bool,
  multiline: PropTypes.bool,
  formatValue: PropTypes.func,
};

const defaultProps = {
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  embedded: undefined,
  multiline: undefined,
  formatValue: undefined,
};

/**
 * An input that displays a value, but does not allow it to be edited.
 */
export default function ReadOnlyInput(props) {
  const {
    name,
    value,
    embedded,
    multiline,
    formatValue,
  } = props;

  const classes = classNames(
    embedded ? styles.embedded : styles.normal,
    multiline ? styles.multiline : styles.oneline,
  );

  return (
    <div
      className={classes}
      data-name={name}
      style={preserveWhiteSpace}
    >
      {formatValue ? formatValue(value) : value}
    </div>
  );
}

ReadOnlyInput.propTypes = propTypes;
ReadOnlyInput.defaultProps = defaultProps;
