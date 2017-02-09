import React, { Component, PropTypes } from 'react';
import { getDisplayName } from 'cspace-refname';
import PrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withNormalizedOptions from '../enhancers/withNormalizedOptions';

const BaseDropdownMenuInput = withNormalizedOptions(PrefixFilteringDropdownMenuInput);

const propTypes = {
  ...PrefixFilteringDropdownMenuInput.propTypes,
  terms: PropTypes.arrayOf(PropTypes.shape({
    refName: PropTypes.string,
    displayName: PropTypes.string,
  })),
  onMount: PropTypes.func,
};

export default class VocabularyControlledInput extends Component {
  componentDidMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  render() {
    const {
      terms,
      value,
      /* eslint-disable no-unused-vars */
      onMount,
      /* eslint-disable no-unused-vars */
      ...remainingProps
    } = this.props;

    const options = terms ? terms.map(term => ({
      value: term.refName,
      label: term.displayName,
    })) : [];

    return (
      <BaseDropdownMenuInput
        options={options}
        value={value}
        valueLabel={getDisplayName(value)}
        {...remainingProps}
      />
    );
  }
}

VocabularyControlledInput.propTypes = propTypes;
