import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import BaseLineInput from './LineInput';
import RecordTypeInput from './RecordTypeInput';
import VocabularyInput from './VocabularyInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import styles from '../../styles/cspace-input/QuickSearchInput.css';

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  formatVocabularyLabel: PropTypes.func,
  keywordValue: PropTypes.string,
  placeholder: PropTypes.string,
  searchButtonLabel: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  recordTypes: PropTypes.objectOf(PropTypes.object),
  recordTypeValue: PropTypes.string,
  vocabularyValue: PropTypes.string,
  onKeywordCommit: PropTypes.func,
  onRecordTypeCommit: PropTypes.func,
  onVocabularyCommit: PropTypes.func,
  search: PropTypes.func,
};

const defaultProps = {
  formatRecordTypeLabel: undefined,
  formatVocabularyLabel: undefined,
  keywordValue: undefined,
  placeholder: undefined,
  searchButtonLabel: undefined,
  recordTypes: undefined,
  recordTypeValue: undefined,
  vocabularyValue: undefined,
  onKeywordCommit: undefined,
  onRecordTypeCommit: undefined,
  onVocabularyCommit: undefined,
  search: undefined,
};

const LineInput = committable(changeable(BaseLineInput));

export default class QuickSearchInput extends Component {
  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeywordInputCommit = this.handleKeywordInputCommit.bind(this);
    this.handleRecordTypeDropdownCommit = this.handleRecordTypeDropdownCommit.bind(this);
    this.handleVocabularyDropdownCommit = this.handleVocabularyDropdownCommit.bind(this);
    this.handleVocabularyDropdownUpdate = this.handleVocabularyDropdownUpdate.bind(this);
  }

  handleButtonClick() {
    const {
      search,
    } = this.props;

    if (search) {
      search();
    }
  }

  handleKeywordInputCommit(path, value) {
    const {
      onKeywordCommit,
    } = this.props;

    if (onKeywordCommit) {
      onKeywordCommit(value);
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      const {
        search,
      } = this.props;

      if (search) {
        search();
      }
    }
  }

  handleRecordTypeDropdownCommit(path, value) {
    const {
      onRecordTypeCommit,
    } = this.props;

    if (onRecordTypeCommit) {
      onRecordTypeCommit(value);
    }
  }

  handleVocabularyDropdownCommit(path, value) {
    const {
      onVocabularyCommit,
    } = this.props;

    if (onVocabularyCommit) {
      onVocabularyCommit(value);
    }
  }

  handleVocabularyDropdownUpdate({ value }) {
    const {
      vocabularyValue,
      onVocabularyCommit,
    } = this.props;

    if (onVocabularyCommit && value !== vocabularyValue) {
      onVocabularyCommit(value);
    }
  }

  renderRecordTypeDropdown() {
    const {
      formatRecordTypeLabel,
      recordTypes,
      recordTypeValue,
    } = this.props;

    return (
      <RecordTypeInput
        embedded
        formatRecordTypeLabel={formatRecordTypeLabel}
        recordTypes={recordTypes}
        value={recordTypeValue}
        onCommit={this.handleRecordTypeDropdownCommit}
        onKeyPress={this.handleKeyPress}
      />
    );
  }

  renderVocabularyDropdown() {
    const {
      formatVocabularyLabel,
      recordTypes,
      recordTypeValue,
      vocabularyValue,
    } = this.props;

    return (
      <VocabularyInput
        embedded
        formatVocabularyLabel={formatVocabularyLabel}
        recordTypes={recordTypes}
        recordType={recordTypeValue}
        value={vocabularyValue}
        onCommit={this.handleVocabularyDropdownCommit}
        onKeyPress={this.handleKeyPress}
        onMount={this.handleVocabularyDropdownUpdate}
        onUpdate={this.handleVocabularyDropdownUpdate}
      />
    );
  }

  renderKeywordInput() {
    const {
      keywordValue,
      placeholder,
    } = this.props;

    return (
      <LineInput
        embedded
        placeholder={placeholder}
        value={keywordValue}
        onCommit={this.handleKeywordInputCommit}
        onKeyPress={this.handleKeyPress}
      />
    );
  }

  render() {
    const {
      searchButtonLabel,
    } = this.props;

    return (
      <div className={styles.normal}>
        <div>
          {this.renderRecordTypeDropdown()}
          {this.renderVocabularyDropdown()}
          {this.renderKeywordInput()}
        </div>
        <Button
          aria-label={searchButtonLabel}
          onClick={this.handleButtonClick}
        />
      </div>
    );
  }
}

QuickSearchInput.propTypes = propTypes;
QuickSearchInput.defaultProps = defaultProps;
