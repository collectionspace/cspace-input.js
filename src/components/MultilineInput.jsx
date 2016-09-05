import React from 'react';

import bindCommonEvents from '../utils/bindCommonEvents';

import styles from '../../styles/cspace-input/MultilineInput.css';

const TextArea = bindCommonEvents('textarea');

/**
 * A text input that accepts and is able to display multiple lines of text. This component takes up
 * more screen space when rendered than LineInput.
 */
export default function MultilineInput(props) {
  return (
    <TextArea
      className={styles.common}
      {...props}
    />
  );
}

MultilineInput.propTypes = {
  /**
   * The value.
   */
  value: React.PropTypes.string,

  /**
   * If true, the input is not interactive. The onChangeRequest and onCommit callbacks will not be
   * executed.
   */
  disabled: React.PropTypes.bool,

  /**
   * Callback to be executed when a change to the value is requested due to user interaction, such
   * as typing or pasting. If this property is supplied, the input will become a controlled
   * component: its displayed value will not update automatically as keys are pressed, but must
   * instead be set via props.
   *
   * The callback is passed the requested new value.
   */
  onChange: React.PropTypes.func,

  /**
   * Callback to be executed when the value is committed due to user interaction. The value is
   * committed when the enter key is pressed while  the input is focused, and when the component
   * loses focus, such as by tabbing or clicking away.
   *
   * The callback is passed the value to be committed.
   */
  onCommit: React.PropTypes.func,
};

MultilineInput.defaultProps = {
  value: '',
  disabled: false,
};
