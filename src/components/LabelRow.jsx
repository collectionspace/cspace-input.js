import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/LabelRow.css';

export default function LabelRow(props) {
  const {
    children,
    embedded,
  } = props;

  const labelContainers = React.Children.map(children, child => (
    <div>{child}</div>
  ));

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <div className={className}>
      {labelContainers}
    </div>
  );
}

LabelRow.propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
};

LabelRow.defaultProps = {
  embedded: false,
};
