import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'cspace-refname';
import ReadOnlyInput from './ReadOnlyInput';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import QuickAdd from './QuickAdd';
import parseResourceID from '../helpers/parseResourceID';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/AutocompleteInput.css';

const propTypes = {
  ...FilteringDropdownMenuInput.propTypes,
  addTerm: PropTypes.func,
  findMatchingTerms: PropTypes.func,
  formatAddPrompt: PropTypes.func,
  formatMoreCharsRequiredMessage: PropTypes.func,
  formatSearchResultMessage: PropTypes.func,
  formatSourceName: PropTypes.func,
  matches: PropTypes.object,
  minLength: PropTypes.number,
  recordTypes: PropTypes.object,
  showQuickAdd: PropTypes.bool,
  readOnly: PropTypes.bool,
  source: PropTypes.string,
  matchFilter: PropTypes.func,
};

const defaultProps = {
  formatMoreCharsRequiredMessage: () => 'Continue typing to find matching terms',
  formatSearchResultMessage: (count) => {
    const matches = count === 1 ? 'matching term' : 'matching terms';
    const num = count === 0 ? 'No' : count;

    return `${num} ${matches} found`;
  },
  matchFilter: () => true,
  // TODO: Make configurable
  minLength: 3,
  showQuickAdd: true,
};

const getOptions = (sourceID, matches, partialTerm, matchFilter) => {
  const sources = parseResourceID(sourceID);
  const options = [];

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      sources.forEach((source) => {
        const {
          recordType,
          vocabulary,
        } = source;

        const sourceMatch = partialTermMatch.getIn([recordType, vocabulary]);

        if (sourceMatch) {
          const items = sourceMatch.get('items');

          if (items) {
            const sourceOptions = items.filter(matchFilter).map(item => ({
              value: item.refName,
              label: getDisplayName(item.refName),
              meta: item,
            }));

            options.push(...sourceOptions);
          }
        }
      });
    }
  }

  return options;
};

const isPending = (sourceID, matches, partialTerm) => {
  const sources = parseResourceID(sourceID);
  let foundPending = false;

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      sources.forEach((source) => {
        const {
          recordType,
          vocabulary,
        } = source;

        const sourceMatch = partialTermMatch.getIn([recordType, vocabulary]);

        if (sourceMatch) {
          foundPending = foundPending || sourceMatch.get('isSearchPending') || sourceMatch.get('isAddPending');
        }
      });
    }
  }

  return foundPending;
};

const getNewTerm = (sourceID, matches, partialTerm) => {
  const sources = parseResourceID(sourceID);

  let newTerm = null;

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      sources.forEach((source) => {
        const {
          recordType,
          vocabulary,
        } = source;

        const sourceMatch = partialTermMatch.getIn([recordType, vocabulary]);

        if (sourceMatch) {
          newTerm = newTerm || sourceMatch.get('newTerm');
        }
      });
    }
  }

  return newTerm;
};

export default class AutocompleteInput extends Component {
  constructor(props) {
    super(props);

    this.findMatchingTerms = this.findMatchingTerms.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleDropdownInputRef = this.handleDropdownInputRef.bind(this);

    this.state = {
      partialTerm: null,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const newTerm = getNewTerm(
      nextProps.source, nextProps.matches, this.state.partialTerm
    );

    const hadNewTerm = getNewTerm(
      this.props.source, this.props.matches, this.state.partialTerm
    );

    if (newTerm && !hadNewTerm) {
      const refName = newTerm.getIn(['document', 'ns2:collectionspace_core', 'refName']);
      const uri = newTerm.getIn(['document', 'ns2:collectionspace_core', 'uri']);
      const csid = uri.substring(uri.lastIndexOf('/') + 1);

      this.commit(refName, { csid });
      this.dropdownInput.close();
    } else {
      const newState = {
        value: nextProps.value,
      };

      if (!isPending(
        nextProps.source, nextProps.matches, this.state.partialTerm
      )) {
        newState.options = getOptions(
          nextProps.source, nextProps.matches, this.state.partialTerm, nextProps.matchFilter
        );
      }

      this.setState(newState);
    }
  }

  commit(value, meta) {
    this.setState({
      options: [],
      partialTerm: null,
      value,
    });

    const {
      onCommit,
    } = this.props;

    const csid = meta ? meta.csid : undefined;

    if (onCommit) {
      onCommit(getPath(this.props), value, csid);
    }
  }

  findMatchingTerms(partialTerm) {
    const {
      source,
      findMatchingTerms,
      matches,
      minLength,
      matchFilter,
    } = this.props;

    const newState = {
      partialTerm,
    };

    const searchNeeded =
      findMatchingTerms && partialTerm
      && partialTerm.length >= minLength
      && (!matches || !matches.has(partialTerm));

    if (searchNeeded) {
      // TODO: Pause to debounce
      findMatchingTerms(partialTerm);
    } else {
      newState.options = getOptions(source, matches, partialTerm, matchFilter);
    }

    this.setState(newState);
  }

  handleDropdownInputCommit(path, value, meta) {
    this.commit(value, meta);
  }

  handleDropdownInputRef(ref) {
    this.dropdownInput = ref;
  }

  renderQuickAdd() {
    const {
      addTerm,
      formatAddPrompt,
      formatSourceName,
      minLength,
      recordTypes,
      showQuickAdd,
      source,
    } = this.props;

    const {
      partialTerm,
    } = this.state;

    if (showQuickAdd && partialTerm && partialTerm.length >= minLength) {
      return (
        <QuickAdd
          add={addTerm}
          displayName={partialTerm}
          formatAddPrompt={formatAddPrompt}
          formatDestinationName={formatSourceName}
          recordTypes={recordTypes}
          to={source}
        />
      );
    }

    return null;
  }

  renderReadOnly() {
    const {
      value,
    } = this.state;

    return (
      <ReadOnlyInput
        value={getDisplayName(value)}
      />
    );
  }

  render() {
    const {
      formatMoreCharsRequiredMessage,
      formatSearchResultMessage,
      matches,
      minLength,
      readOnly,
      source,
      /* eslint-disable no-unused-vars */
      addTerm,
      findMatchingTerms,
      formatAddPrompt,
      formatSourceName,
      recordTypes,
      showQuickAdd,
      matchFilter,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      options,
      partialTerm,
      value,
    } = this.state;

    if (readOnly) {
      return this.renderReadOnly();
    }

    const moreCharsRequired = (
      typeof partialTerm !== 'undefined' &&
      partialTerm !== null &&
      partialTerm.length < minLength
    );

    const formatStatusMessage = moreCharsRequired
      ? formatMoreCharsRequiredMessage
      : formatSearchResultMessage;

    const className = isPending(source, matches, partialTerm)
      ? styles.searching
      : styles.normal;

    return (
      <FilteringDropdownMenuInput
        {...remainingProps}
        className={className}
        filter={this.findMatchingTerms}
        formatStatusMessage={formatStatusMessage}
        menuFooter={this.renderQuickAdd()}
        options={options}
        ref={this.handleDropdownInputRef}
        value={value}
        valueLabel={getDisplayName(value)}
        onCommit={this.handleDropdownInputCommit}
      />
    );
  }
}

AutocompleteInput.propTypes = propTypes;
AutocompleteInput.defaultProps = defaultProps;
