import React, { PropTypes } from 'react';

export default function uncontrolled(BaseComponent) {
  const Uncontrolled = (props) => {
    const {
      value,
      ...remainingProps,
    } = props;

    return (
      <BaseComponent
        defaultValue={value}
        {...remainingProps}
      />
    );
  };

  Uncontrolled.propTypes = {
    value: PropTypes.string,
  };

  return Uncontrolled;
}
