import React, { PropTypes } from 'react';
import LineInput from './LineInput';
import MultilineInput from './MultilineInput';

function getInputComponent(multiline, value) {
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
    ...remainingProps,
  } = props;

  const InputComponent = getInputComponent(multiline, value);

  return (
    <InputComponent
      value={value}
      {...remainingProps}
    />
  );
}

TextInput.propTypes = {
  name: PropTypes.string,

  /**
   * The value.
   */
  value: PropTypes.string,

  /**
   * A tri-state boolean specifying the mode of the input. If true, the input is set to multiline
   * mode. If false, single line mode. If null or undefined, fallback mode.
   */
  multiline: PropTypes.bool,

  /**
   * If true, the input is not interactive. The onChangeRequest and onCommit callbacks will not be
   * executed.
   */
  disabled: PropTypes.bool,

  /**
   * Callback to be executed when a change to the value is requested due to user interaction, such
   * as typing or pasting. If this property is supplied, the input will become a controlled
   * component: its displayed value will not update automatically as keys are pressed, but must
   * instead be set via props.
   *
   * The callback is passed the requested new value.
   */
  onChange: PropTypes.func,

  /**
   * Callback to be executed when the value is committed due to user interaction. The value is
   * committed when the enter key is pressed while  the input is focused, and when the component
   * loses focus, such as by tabbing or clicking away.
   *
   * The callback is passed the value to be committed.
   */
  onCommit: PropTypes.func,
};

TextInput.defaultProps = {
  name: '',
  value: '',
  multiline: null,
  disabled: false,
};
