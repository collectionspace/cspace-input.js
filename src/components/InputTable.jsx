import React from 'react';
import PropTypes from 'prop-types';
import InputTableHeader from './InputTableHeader';
import InputTableRow from './InputTableRow';
import styles from '../../styles/cspace-input/InputTable.css';
import labelToLegend from '../helpers/labelToLegend';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  renderLabel: PropTypes.func,
  renderAriaLabel: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  embedded: undefined,
  id: undefined,
  label: undefined,
  renderLabel: undefined,
  renderAriaLabel: undefined,
};

export default function InputTable(props) {
  const {
    children,
    embedded,
    id,
    label,
    renderLabel,
    renderAriaLabel,
  } = props;

  const legend = labelToLegend(label);

  return (
    <fieldset className={styles.common} id={id}>
      {legend}
      <InputTableHeader embedded={embedded} renderLabel={renderLabel}>
        {children}
      </InputTableHeader>

      <InputTableRow embedded={embedded} renderAriaLabel={renderAriaLabel}>
        {children}
      </InputTableRow>
    </fieldset>
  );
}

InputTable.propTypes = propTypes;
InputTable.defaultProps = defaultProps;
InputTable.useLegend = true;
