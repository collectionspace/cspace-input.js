import React, { PropTypes } from 'react';
import styles from '../../styles/cspace-input/Label.css';

/**
 * A label for an input.
 */
export default function Label(props) {
  const {
    children,
  } = props;

  /* FIXME: Set the htmlFor prop to associate the labeled control. */
  /* eslint-disable jsx-a11y/label-has-for */

  return (
    <label className={styles.common}>
      {children}
    </label>
  );

  /* eslint-enable jsx-a11y/label-has-for */
}

Label.propTypes = {
  children: PropTypes.node,
};

export function normalizeLabel(label) {
  return (label && typeof label === 'string') ? <Label>{label}</Label> : label;
}
