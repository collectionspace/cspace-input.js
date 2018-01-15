import React from 'react';
import PropTypes from 'prop-types';
import { extractInputs } from '../helpers/inputHelpers';
import styles from '../../styles/cspace-input/InputTableRow.css';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
};

export default function InputTableRow(props) {
  const {
    children,
    embedded,
  } = props;

  const inputs = extractInputs(children);

  const modifiedInputs = inputs.map(input => React.cloneElement(input, {
    label: undefined,
    embedded: true,
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
