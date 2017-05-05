import React, { Component, PropTypes } from 'react';
import { getDisplayName } from 'cspace-refname';
import ReadOnlyInput from './ReadOnlyInput';
import FilteringDropdownMenuInput from './FilteringDropdownMenuInput';
import QuickAdd from './QuickAdd';
import parseAuthoritySpec from '../helpers/parseAuthoritySpec';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/AuthorityControlledInput.css';

const propTypes = {
  ...FilteringDropdownMenuInput.propTypes,
  addTerm: PropTypes.func,
  authority: PropTypes.string,
  findMatchingTerms: PropTypes.func,
  formatMoreCharsRequiredMessage: PropTypes.func,
  formatSearchResultMessage: PropTypes.func,
  formatVocabName: PropTypes.func,
  matches: PropTypes.object,
  minLength: PropTypes.number,
  recordTypes: PropTypes.object,
  showQuickAdd: PropTypes.bool,
  readOnly: PropTypes.bool,
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

const getOptions = (authority, matches, partialTerm, matchFilter) => {
  const authorities = parseAuthoritySpec(authority);
  const options = [];

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      authorities.forEach((authoritySpec) => {
        const {
          authorityName,
          vocabularyName,
        } = authoritySpec;

        const authorityMatch = partialTermMatch.getIn([authorityName, vocabularyName]);

        if (authorityMatch) {
          const items = authorityMatch.get('items');

          if (items) {
            const authorityOptions = items.filter(matchFilter).map(item => ({
              value: item.refName,
              label: item.termDisplayName,
              meta: item,
            }));

            options.push(...authorityOptions);
          }
        }
      });
    }
  }

  return options;
};

const isPending = (authority, matches, partialTerm) => {
  const authorities = parseAuthoritySpec(authority);
  let foundPending = false;

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      authorities.forEach((authoritySpec) => {
        const {
          authorityName,
          vocabularyName,
        } = authoritySpec;

        const authorityMatch = partialTermMatch.getIn([authorityName, vocabularyName]);

        if (authorityMatch) {
          foundPending = foundPending || authorityMatch.get('isSearchPending') || authorityMatch.get('isAddPending');
        }
      });
    }
  }

  return foundPending;
};

const getNewTerm = (authority, matches, partialTerm) => {
  const authorities = parseAuthoritySpec(authority);

  let newTerm = null;

  if (matches) {
    const partialTermMatch = matches.get(partialTerm);

    if (partialTermMatch) {
      authorities.forEach((authoritySpec) => {
        const {
          authorityName,
          vocabularyName,
        } = authoritySpec;

        const authorityMatch = partialTermMatch.getIn([authorityName, vocabularyName]);

        if (authorityMatch) {
          newTerm = newTerm || authorityMatch.get('newTerm');
        }
      });
    }
  }

  return newTerm;
};

export default class AuthorityControlledInput extends Component {
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
      nextProps.authority, nextProps.matches, this.state.partialTerm
    );

    const hadNewTerm = getNewTerm(
      this.props.authority, this.props.matches, this.state.partialTerm
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
        nextProps.authority, nextProps.matches, this.state.partialTerm
      )) {
        newState.options = getOptions(
          nextProps.authority, nextProps.matches, this.state.partialTerm, nextProps.matchFilter
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
      authority,
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
      newState.options = getOptions(authority, matches, partialTerm, matchFilter);
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
      authority,
      formatVocabName,
      minLength,
      recordTypes,
      showQuickAdd,
    } = this.props;

    const {
      partialTerm,
    } = this.state;

    if (showQuickAdd && partialTerm && partialTerm.length >= minLength) {
      return (
        <QuickAdd
          add={addTerm}
          authority={authority}
          displayName={partialTerm}
          formatVocabName={formatVocabName}
          recordTypes={recordTypes}
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
      authority,
      formatMoreCharsRequiredMessage,
      formatSearchResultMessage,
      matches,
      minLength,
      readOnly,
      /* eslint-disable no-unused-vars */
      addTerm,
      findMatchingTerms,
      formatVocabName,
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

    const className = isPending(authority, matches, partialTerm)
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

AuthorityControlledInput.propTypes = propTypes;
AuthorityControlledInput.defaultProps = defaultProps;
