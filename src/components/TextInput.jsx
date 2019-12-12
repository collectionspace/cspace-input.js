import React from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import MultilineInput from './MultilineInput';
import { pathPropType } from '../helpers/pathHelpers';

// FIXME: Rationalize these propTypes. Make consistent across LineInput, MultilineInput, and
// TextInput.
const propTypes = {
  'aria-label': PropTypes.string,
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
  'aria-label': undefined,
  autoComplete: undefined,
  embedded: undefined,
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  readOnly: undefined,
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
    ...remainingProps
  } = props;

  const {
    value,
  } = remainingProps;

  const BaseComponent = getBaseComponent(multiline, value);

  return (
    <BaseComponent
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
    />
  );
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;
