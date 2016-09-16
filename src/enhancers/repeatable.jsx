import React, { PropTypes } from 'react';
import RepeatingInput from '../components/RepeatingInput';

export default function repeatable(BaseComponent) {
  const Repeatable = (props) => {
    const {
      repeating,
      value,
      ...remainingProps,
    } = props;

    if (!repeating) {
      return (
        <BaseComponent value={value} {...remainingProps} />
      );
    }

    return (
      <RepeatingInput value={value}>
        <BaseComponent {...remainingProps} />
      </RepeatingInput>
    );
  };

  Repeatable.propTypes = {
    repeating: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ])),
    ]),
  };

  Repeatable.defaultProps = {
    repeating: false,
  };

  return Repeatable;
}
