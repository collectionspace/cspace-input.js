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
    ...remainingProps,
  } = props;

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <textarea
      className={className}
      {...remainingProps}
    />
  );
};

MultilineInput.propTypes = {
  embedded: PropTypes.bool,
};

MultilineInput.defaultProps = {
  embedded: false,
};

MultilineInput.isInput = true;

export default enhanced(MultilineInput);
