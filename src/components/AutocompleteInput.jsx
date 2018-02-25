/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { getDisplayName, setDisplayName } from 'cspace-refname';
import LineInput from './LineInput';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import QuickAdd from './QuickAdd';
import parseResourceID from '../helpers/parseResourceID';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/AutocompleteInput.css';

const propTypes = {
  ...FilteringDropdownMenuInput.propTypes,
  findDelay: PropTypes.number,
  matches: PropTypes.object,
  minLength: PropTypes.number,
  recordTypes: PropTypes.object,
  disableAltTerms: PropTypes.bool,
  showQuickAdd: PropTypes.bool,
  showQuickAddCloneOption: PropTypes.bool,
  readOnly: PropTypes.bool,
  asText: PropTypes.bool,
  source: PropTypes.string,
  quickAddTo: PropTypes.string,
  addTerm: PropTypes.func,
  findMatchingTerms: PropTypes.func,
  formatAddPrompt: PropTypes.func,
  formatCloneOptionLabel: PropTypes.func,
  formatCreateNewOptionLabel: PropTypes.func,
  formatMoreCharsRequiredMessage: PropTypes.func,
  formatSearchResultMessage: PropTypes.func,
  formatSourceName: PropTypes.func,
  matchFilter: PropTypes.func,
};

const defaultProps = {
  findDelay: 500, // ms
  matchFilter: () => true,
  minLength: 3,
  showQuickAdd: true,
  formatMoreCharsRequiredMessage: () => 'Continue typing to find matching terms',
  formatSearchResultMessage: (count) => {
    const matches = count === 1 ? 'matching term' : 'matching terms';
    const num = count === 0 ? 'No' : count;

    return `${num} ${matches} found`;
  },
};

const getOptions = (partialTerm, props) => {
  const {
    recordTypes,
    matches,
    matchFilter,
    disableAltTerms,
    source: sourceID,
  } = props;

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
          const vocabDisableAltTerms = get(recordTypes, [recordType, 'vocabularies', vocabulary, 'disableAltTerms']);
          const items = sourceMatch.get('items');

          if (items) {
            items.filter(matchFilter).forEach((item) => {
              // TODO: Use a prop to specify the name of the item's display name field.
              let displayNames = item.termDisplayName || item.objectNumber;

              const {
                workflowState,
              } = item;

              const deprecated = workflowState && workflowState.includes('deprecated');

              if (!Array.isArray(displayNames)) {
                displayNames = [displayNames];
              }

              displayNames.forEach((displayName, index) => {
                const disabled = (
                  deprecated ||
                  (index > 0 && (disableAltTerms || vocabDisableAltTerms))
                );

                options.push({
                  disabled,
                  value: setDisplayName(item.refName, displayName),
                  label: displayName,
                  meta: item,
                  indent: (index === 0 ? 0 : 1),
                });
              });
            });
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

/**
 * Remove anchor and wildcard operators from partial terms.
 */
const removePartialTermOperators = (partialTerm) => {
  if (!partialTerm) {
    return partialTerm;
  }

  return (
    partialTerm
      .replace(/^\^/, '')
      .replace(/\^$/, '')
      .replace(/\*/g, '')
  );
};

export default class AutocompleteInput extends Component {
  constructor(props) {
    super(props);

    this.findMatchingTerms = this.findMatchingTerms.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleFilteringDropdownMenuInputRef = this.handleFilteringDropdownMenuInputRef.bind(this);
    this.handleQuickAddBeforeItemFocusChange = this.handleQuickAddBeforeItemFocusChange.bind(this);
    this.handleDropdownBeforeItemFocusChange = this.handleDropdownBeforeItemFocusChange.bind(this);
    this.handleQuickAddRef = this.handleQuickAddRef.bind(this);
    this.handleDropdownMenuInputRef = this.handleDropdownMenuInputRef.bind(this);
    this.handleFocusPopup = this.handleFocusPopup.bind(this);

    this.state = {
      partialTerm: null,
      value: props.value,
      isFindTimerActive: false,
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
      this.filteringDropdownMenuInput.close();
    } else {
      const newState = {
        value: nextProps.value,
      };

      if (!isPending(
        nextProps.source, nextProps.matches, this.state.partialTerm
      )) {
        newState.options = getOptions(
          this.state.partialTerm,
          nextProps,
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
    if (this.findTimer) {
      window.clearTimeout(this.findTimer);

      this.findTimer = null;
    }

    const {
      findDelay,
      findMatchingTerms,
      matches,
      minLength,
      source,
    } = this.props;

    const newState = {
      partialTerm,
    };

    const searchNeeded =
      findMatchingTerms && partialTerm
      && removePartialTermOperators(partialTerm).length >= minLength
      && (!matches || !matches.has(partialTerm));

    if (searchNeeded) {
      this.findTimer = window.setTimeout(() => {
        findMatchingTerms(source, partialTerm);

        this.findTimer = null;

        this.setState({
          isFindTimerActive: false,
        });
      }, findDelay);
    } else {
      newState.options = getOptions(partialTerm, this.props);
    }

    newState.isFindTimerActive = !!this.findTimer;

    this.setState(newState);
  }

  handleDropdownInputCommit(path, value, meta) {
    this.commit(value, meta);
  }

  handleFilteringDropdownMenuInputRef(ref) {
    this.filteringDropdownMenuInput = ref;
  }

  handleDropdownMenuInputRef(ref) {
    this.dropdownMenuInput = ref;
  }

  handleQuickAddRef(ref) {
    this.quickAdd = ref;
  }

  handleQuickAddBeforeItemFocusChange(currentFocusedIndex, nextFocusedIndex, eventKey) {
    const {
      options,
    } = this.state;

    if (this.dropdownMenuInput && options && options.length > 0) {
      if (nextFocusedIndex === 0 && eventKey === 'ArrowDown') {
        this.dropdownMenuInput.focusMenu(0);
        return null;
      } else if (currentFocusedIndex <= 0 && eventKey === 'ArrowUp') {
        this.dropdownMenuInput.focusMenu(-1);
        return null;
      }
    }

    return nextFocusedIndex;
  }

  handleDropdownBeforeItemFocusChange(currentFocusedIndex, nextFocusedIndex, eventKey) {
    if (this.quickAdd) {
      if (nextFocusedIndex === 0 && eventKey === 'ArrowDown') {
        this.quickAdd.focusMenu(0);
        return null;
      } else if (currentFocusedIndex <= 0 && eventKey === 'ArrowUp') {
        this.quickAdd.focusMenu(-1);
        return null;
      }
    }

    return nextFocusedIndex;
  }

  handleFocusPopup() {
    const {
      options,
    } = this.state;

    if (options && options.length > 0) {
      if (this.dropdownMenuInput) {
        this.dropdownMenuInput.focusMenu(0);
      }
    } else if (this.quickAdd) {
      this.quickAdd.focusMenu(0);
    }
  }

  renderMenuFooter() {
    const {
      menuFooter,
    } = this.props;

    return (
      <div>
        {this.renderQuickAdd()}
        {menuFooter}
      </div>
    );
  }

  renderQuickAdd() {
    const {
      addTerm,
      formatAddPrompt,
      formatCloneOptionLabel,
      formatCreateNewOptionLabel,
      formatSourceName,
      minLength,
      quickAddTo,
      recordTypes,
      showQuickAdd,
      showQuickAddCloneOption,
      source,
    } = this.props;

    const to = (typeof quickAddTo === 'undefined') ? source : quickAddTo;

    const {
      partialTerm,
    } = this.state;

    const partialTermText = removePartialTermOperators(partialTerm);

    if (
      showQuickAdd && partialTerm &&
      partialTermText.length >= minLength
    ) {
      return (
        <QuickAdd
          add={addTerm}
          displayName={partialTermText}
          partialTerm={partialTerm}
          formatAddPrompt={formatAddPrompt}
          formatCloneOptionLabel={formatCloneOptionLabel}
          formatCreateNewOptionLabel={formatCreateNewOptionLabel}
          formatDestinationName={formatSourceName}
          recordTypes={recordTypes}
          showCloneOption={showQuickAddCloneOption}
          to={to}
          onBeforeItemFocusChange={this.handleQuickAddBeforeItemFocusChange}
          ref={this.handleQuickAddRef}
        />
      );
    }

    return null;
  }

  renderReadOnly() {
    const {
      asText,
      embedded,
      readOnly,
    } = this.props;

    const {
      value,
    } = this.state;

    return (
      <LineInput
        asText={asText}
        readOnly={readOnly}
        value={getDisplayName(value)}
        embedded={embedded}
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
      asText,
      source,
      /* eslint-disable no-unused-vars */
      addTerm,
      findDelay,
      findMatchingTerms,
      formatAddPrompt,
      formatCloneOptionLabel,
      formatCreateNewOptionLabel,
      formatSourceName,
      matchFilter,
      recordTypes,
      quickAddTo,
      showQuickAdd,
      showQuickAddCloneOption,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      isFindTimerActive,
      options,
      partialTerm,
      value,
    } = this.state;

    if (asText || readOnly) {
      return this.renderReadOnly();
    }

    const moreCharsRequired = (
      typeof partialTerm !== 'undefined' &&
      partialTerm !== null &&
      removePartialTermOperators(partialTerm).length < minLength
    );

    const formatStatusMessage = moreCharsRequired
      ? formatMoreCharsRequiredMessage
      : formatSearchResultMessage;

    const className = (isFindTimerActive || isPending(source, matches, partialTerm))
      ? styles.searching
      : styles.normal;

    return (
      <FilteringDropdownMenuInput
        {...remainingProps}
        className={className}
        filter={this.findMatchingTerms}
        formatStatusMessage={formatStatusMessage}
        menuFooter={this.renderMenuFooter()}
        openOnMouseDown={false}
        options={options}
        ref={this.handleFilteringDropdownMenuInputRef}
        value={value}
        valueLabel={getDisplayName(value) || value}
        onCommit={this.handleDropdownInputCommit}
        onBeforeItemFocusChange={this.handleDropdownBeforeItemFocusChange}
        onMount={this.handleDropdownMenuInputRef}
        focusPopup={this.handleFocusPopup}
      />
    );
  }
}

AutocompleteInput.propTypes = propTypes;
AutocompleteInput.defaultProps = defaultProps;
