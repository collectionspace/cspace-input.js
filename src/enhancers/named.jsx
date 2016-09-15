import React, { PropTypes } from 'react';

export default function named(BaseComponent) {
  const Named = (props) => {
    const {
      path, // eslint-disable-line no-unused-vars
      ...remainingProps,
    } = props;

    return (
      <BaseComponent
        {...remainingProps}
      />
    );
  };

  Named.propTypes = {
    name: PropTypes.string,
    path: PropTypes.string,
  };

  return Named;
}
