import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomCompoundInput from './CustomCompoundInput';
import InputTableRow from './InputTableRow';
import InputTableHeader from './InputTableHeader';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import { getPath } from '../helpers/pathHelpers';
import labelToLegend from '../helpers/labelToLegend';

const BaseComponent = repeatable(labelable(CustomCompoundInput));

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...BaseComponent.propTypes,
  children: PropTypes.node,
  label: PropTypes.node,
  repeating: PropTypes.bool,
  sortableFields: PropTypes.objectOf(PropTypes.bool),
  onSortInstances: PropTypes.func,
  renderAriaLabel: PropTypes.func,
  renderChildInputLabel: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  label: undefined,
  repeating: undefined,
  sortableFields: undefined,
  onSortInstances: undefined,
  renderAriaLabel: undefined,
  renderChildInputLabel: undefined,
};

export default class TabularCompoundInput extends Component {
  constructor() {
    super();

    this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
  }

  handleSortButtonClick(event) {
    const {
      onSortInstances,
    } = this.props;

    if (onSortInstances) {
      onSortInstances(getPath(this.props), event.currentTarget.dataset.name);
    }
  }

  render() {
    const {
      children,
      label,
      repeating,
      renderAriaLabel,
      renderChildInputLabel,
      sortableFields,
      ...remainingProps
    } = this.props;

    const tableHeader = (
      <InputTableHeader
        embedded={repeating}
        renderLabel={renderChildInputLabel}
        sortableFields={sortableFields}
        onSortButtonClick={this.handleSortButtonClick}
      >
        {children}
      </InputTableHeader>
    );

    const legend = labelToLegend(label);

    return (
      <>
        {legend}
        <BaseComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...remainingProps}
          label={tableHeader}
          repeating={repeating}
        >
          <InputTableRow embedded={repeating} renderAriaLabel={renderAriaLabel}>
            {children}
          </InputTableRow>
        </BaseComponent>
      </>
    );
  }
}

TabularCompoundInput.propTypes = propTypes;
TabularCompoundInput.defaultProps = defaultProps;
TabularCompoundInput.useLegend = true;
