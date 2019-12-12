import React from 'react';
import PropTypes from 'prop-types';
import { extractInputs } from '../helpers/inputHelpers';
import normalizeLabel from '../helpers/normalizeLabel';
import styles from '../../styles/cspace-input/InputTableHeader.css';

const propTypes = {
  children: PropTypes.node,
  embedded: PropTypes.bool,
  renderLabel: PropTypes.func,
  sortableFields: PropTypes.objectOf(PropTypes.bool),
  onSortButtonClick: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  embedded: undefined,
  renderLabel: (input) => normalizeLabel(input.props.label),
  sortableFields: undefined,
  onSortButtonClick: undefined,
};

export default function InputTableHeader(props) {
  const {
    children,
    embedded,
    renderLabel,
    sortableFields,
    onSortButtonClick,
  } = props;

  const inputs = extractInputs(children);
  const labels = inputs.map((input) => renderLabel(input));

  if (!labels.some((label) => !!label)) {
    return null;
  }

  const labelContainers = labels.map((label, index) => {
    const input = inputs[index];

    const {
      flex,
      name,
    } = input.props;

    const style = flex ? { flex } : undefined;

    let wrappedLabel = label;

    if (onSortButtonClick && sortableFields && sortableFields[name]) {
      wrappedLabel = (
        <button data-name={name} type="button" onClick={onSortButtonClick}>{label}</button>
      );
    }

    return (
      <div
        key={name || index}
        style={style}
      >
        {wrappedLabel}
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
