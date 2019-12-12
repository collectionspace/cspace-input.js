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
  children: undefined,
  embedded: undefined,
  renderAriaLabel: (input) => {
    const { label } = input.props;

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

  const inputContainers = inputs.map((input) => {
    const {
      flex,
    } = input.props;

    const style = flex ? { flex } : undefined;

    const modifiedInput = React.cloneElement(input, {
      flex: undefined,
      label: undefined,
      embedded: true,
      'aria-label': renderAriaLabel(input),
    });

    return (
      <div key={input.props.name} style={style}>{modifiedInput}</div>
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
