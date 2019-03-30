import React from 'react';
import PropTypes from 'prop-types';
import InputTableHeader from './InputTableHeader';
import InputTableRow from './InputTableRow';
import styles from '../../styles/cspace-input/InputTable.css';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
  renderLabel: PropTypes.func,
  renderAriaLabel: PropTypes.func,
};

export default function InputTable(props) {
  const {
    children,
    embedded,
    renderLabel,
    renderAriaLabel,
  } = props;

  return (
    <div className={styles.common}>
      <InputTableHeader embedded={embedded} renderLabel={renderLabel}>
        {children}
      </InputTableHeader>

      <InputTableRow embedded={embedded} renderAriaLabel={renderAriaLabel}>
        {children}
      </InputTableRow>
    </div>
  );
}

InputTable.propTypes = propTypes;
