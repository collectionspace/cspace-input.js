import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/InputRow.css';

export default function InputRow(props) {
  const {
    children,
    embedded,
  } = props;

  const inputContainers = React.Children.map(children, child => (
    <div>{child}</div>
  ));

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <div className={className}>
      {inputContainers}
    </div>
  );
}

InputRow.propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
};

InputRow.defaultProps = {
  embedded: false,
};
