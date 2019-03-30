import React from 'react';
import PropTypes from 'prop-types';
import { extractInputs } from '../helpers/inputHelpers';
import styles from '../../styles/cspace-input/InputTableRow.css';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
  renderAriaLabel: PropTypes.func,
};

const defaultProps = {
  renderAriaLabel: (input) => {
    const label = input.props.label;

    return (typeof label === 'string') ? label : undefined;
  },
};

export default function InputTableRow(props) {
  const {
    children,
    embedded,
    renderAriaLabel,
  } = props;

  const inputs = extractInputs(children);

  const modifiedInputs = inputs.map(input => React.cloneElement(input, {
    label: undefined,
    embedded: true,
    'aria-label': renderAriaLabel(input),
  }));

  const inputContainers = modifiedInputs.map((input) => {
    const {
      flex,
    } = input.props;

    const style = flex ? { flex } : undefined;

    return (
      <div key={input.props.name} style={style}>{input}</div>
    );
  });

  const className = embedded ? styles.embedded : styles.normal;

  return (
    <div className={className}>
      {inputContainers}
    </div>
  );
}

InputTableRow.propTypes = propTypes;
InputTableRow.defaultProps = defaultProps;
