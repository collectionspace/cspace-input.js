import React, { PropTypes } from 'react';
import enhanced from '../enhancers/enhanced';
import styles from '../../styles/cspace-input/MultilineInput.css';

/**
 * A text input that accepts and is able to display multiple lines of text. This component takes up
 * more screen space when rendered than LineInput.
 */
const MultilineInput = (props) => {
  const {
    embedded,
    name,
    value,
    ...remainingProps,
  } = props;

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <textarea
      className={className}
      name={name}
      value={value}
      {...remainingProps}
    />
  );
};

MultilineInput.propTypes = {
  embedded: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
};

MultilineInput.defaultProps = {
  embedded: false,
  value: '',
};

export default enhanced(MultilineInput);
