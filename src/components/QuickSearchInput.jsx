import React, { Component, PropTypes } from 'react';
import BaseLineInput from './LineInput';
import RecordTypeInput from './RecordTypeInput';
import VocabularyInput from './VocabularyInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import styles from '../../styles/cspace-input/QuickSearchInput.css';

const LineInput = committable(changeable(BaseLineInput));

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  formatVocabularyLabel: PropTypes.func,
  keywordValue: PropTypes.string,
  placeholder: PropTypes.string,
  recordTypes: PropTypes.object,
  recordTypeValue: PropTypes.string,
  vocabularyValue: PropTypes.string,
  onSearch: PropTypes.func,
  onKeywordCommit: PropTypes.func,
  onRecordTypeCommit: PropTypes.func,
  onVocabularyCommit: PropTypes.func,
};

export default class QuickSearchInput extends Component {
  constructor() {
    super();

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeywordInputCommit = this.handleKeywordInputCommit.bind(this);
    this.handleRecordTypeDropdownCommit = this.handleRecordTypeDropdownCommit.bind(this);
    this.handleRecordTypeDropdownUpdate = this.handleRecordTypeDropdownUpdate.bind(this);
    this.handleVocabularyDropdownCommit = this.handleVocabularyDropdownCommit.bind(this);
    this.handleVocabularyDropdownUpdate = this.handleVocabularyDropdownUpdate.bind(this);
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
        onSearch,
      } = this.props;

      if (onSearch) {
        onSearch();
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

  handleRecordTypeDropdownUpdate({ value }) {
    if (value !== this.props.recordTypeValue) {
      // A default was selected.

      const {
        onRecordTypeCommit,
      } = this.props;

      if (onRecordTypeCommit) {
        onRecordTypeCommit(value);
      }
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
    if (value !== this.props.vocabularyValue) {
      // A default was selected.

      const {
        onVocabularyCommit,
      } = this.props;

      if (onVocabularyCommit) {
        onVocabularyCommit(value);
      }
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
        onMount={this.handleRecordTypeDropdownUpdate}
        onUpdate={this.handleRecordTypeDropdownUpdate}
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
    return (
      <div className={styles.normal}>
        {this.renderRecordTypeDropdown()}
        {this.renderVocabularyDropdown()}
        {this.renderKeywordInput()}
      </div>
    );
  }
}

QuickSearchInput.propTypes = propTypes;
