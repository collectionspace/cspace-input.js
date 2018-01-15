import React from 'react';
import PropTypes from 'prop-types';
import { extractInputs } from '../helpers/inputHelpers';
import normalizeLabel from '../helpers/normalizeLabel';
import styles from '../../styles/cspace-input/InputTableHeader.css';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
  renderLabel: PropTypes.func,
};

const defaultProps = {
  renderLabel: input => normalizeLabel(input.props.label),
};

export default function InputTableHeader(props) {
  const {
    children,
    embedded,
    renderLabel,
  } = props;

  const inputs = extractInputs(children);
  const labels = inputs.map(input => renderLabel(input));

  if (!labels.some(label => !!label)) {
    return null;
  }

  const labelContainers = labels.map((label, index) => {
    const input = inputs[index];

    const {
      flex,
    } = input.props;

    const style = flex ? { flex } : undefined;

    return (
      <div
        key={inputs[index].props.name || index}
        style={style}
      >
        {label}
      </div>
    );
  });

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <div className={className}>
      {labelContainers}
    </div>
  );
}

InputTableHeader.propTypes = propTypes;
InputTableHeader.defaultProps = defaultProps;
