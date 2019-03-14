import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import MultilineInput from './MultilineInput';
import { pathPropType } from '../helpers/pathHelpers';

const propTypes = {
  autoComplete: PropTypes.string,
  embedded: PropTypes.bool,
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  multiline: PropTypes.bool,
};

const defaultProps = {
  multiline: null,
};

function getBaseComponent(multiline, value) {
  let isMultiline = false;

  if (typeof multiline === 'undefined' || multiline == null) {
    isMultiline = (value && value.indexOf('\n') >= 0);
  } else if (multiline) {
    isMultiline = true;
  }

  return (isMultiline ? MultilineInput : LineInput);
}

/**
 * A text input. There are three modes: single line, multiline, and fallback.
 *
 * In single line mode, the input is rendered as a LineInput.
 *
 * In multiline mode, the input is rendered as a MultilineInput.
 *
 * In fallback mode, the input is rendered as a LineInput, unless the supplied value contains a
 * newline; then it is rendered as a MultilineInput. Fallback mode is appropriate when existing
 * data to be rendered may contain a mix of single line and multiline values, but new values
 * should be prohibited from containing multiple lines.
 */
export default function TextInput(props) {
  const {
    multiline,
    value,
    ...remainingProps
  } = props;

  const BaseComponent = getBaseComponent(multiline, value);

  return (
    <BaseComponent
      {...remainingProps}
      value={value}
    />
  );
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;
