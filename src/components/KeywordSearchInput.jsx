import React, { Component, PropTypes } from 'react';
import BaseLineInput from './LineInput';
import OptionListControlledInput from './OptionListControlledInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import styles from '../../styles/cspace-input/KeywordSearchInput.css';

const LineInput = committable(changeable(BaseLineInput));

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  formatVocabularyLabel: PropTypes.func,
  keywordValue: PropTypes.string,
  placeholder: PropTypes.string,
  recordTypes: PropTypes.object,
  recordTypeGroupOrder: PropTypes.object,
  recordTypeValue: PropTypes.string,
  vocabularyGroupOrder: PropTypes.object,
  vocabularyValue: PropTypes.string,
  onSearch: PropTypes.func,
  onKeywordCommit: PropTypes.func,
  onRecordTypeCommit: PropTypes.func,
  onVocabularyCommit: PropTypes.func,
};

const defaultProps = {
  formatRecordTypeLabel: (name, config) => {
    const messages = config.messageDescriptors;

    if (messages && messages.recordNameTitle) {
      return messages.recordNameTitle.defaultMessage;
    }

    return name;
  },
  formatVocabularyLabel: (name, config) => {
    const messages = config.messageDescriptors;

    if (messages && messages.vocabNameTitle) {
      return messages.vocabNameTitle.defaultMessage;
    }

    return name;
  },
  recordTypes: {},
  recordTypeGroupOrder: {
    all: 0,
    object: 1,
    procedure: 2,
    authority: 3,
  },
  vocabularyGroupOrder: {
    all: 0,
  },
};

export default class KeywordSearchInput extends Component {
  constructor() {
    super();

    this.handleKeywordInputCommit = this.handleKeywordInputCommit.bind(this);
    this.handleKeywordInputKeyPress = this.handleKeywordInputKeyPress.bind(this);
    this.handleRecordTypeDropdownCommit = this.handleRecordTypeDropdownCommit.bind(this);
    this.handleRecordTypeDropdownMount = this.handleRecordTypeDropdownMount.bind(this);
    this.handleVocabularyDropdownCommit = this.handleVocabularyDropdownCommit.bind(this);
    this.handleVocabularyDropdownMount = this.handleVocabularyDropdownMount.bind(this);
  }

  handleKeywordInputCommit(path, value) {
    const {
      onKeywordCommit,
    } = this.props;

    if (onKeywordCommit) {
      onKeywordCommit(value);
    }
  }

  handleKeywordInputKeyPress(event) {
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

  handleRecordTypeDropdownMount({ value }) {
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

  handleVocabularyDropdownMount({ value }) {
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
      recordTypeGroupOrder,
      recordTypes,
      recordTypeValue,
    } = this.props;

    const sortedRecordTypeNames = Object.keys(recordTypes)
      .sort((nameA, nameB) => {
        const configA = recordTypes[nameA];
        const configB = recordTypes[nameB];

        // Primary sort by group

        const groupA = configA.group;
        const groupB = configB.group;

        if (groupA !== groupB) {
          let groupOrderA = recordTypeGroupOrder[groupA];
          let groupOrderB = recordTypeGroupOrder[groupB];

          if (isNaN(groupOrderA)) {
            groupOrderA = Number.MAX_VALUE;
          }

          if (isNaN(groupOrderB)) {
            groupOrderB = Number.MAX_VALUE;
          }

          if (groupOrderA !== groupOrderB) {
            return (groupOrderA > groupOrderB ? 1 : -1);
          }
        }

        // Secondary sort by sortOrder

        let sortOrderA = configA.sortOrder;
        let sortOrderB = configB.sortOrder;

        if (typeof sortOrderA !== 'number') {
          sortOrderA = Number.MAX_VALUE;
        }

        if (typeof sortOrderB !== 'number') {
          sortOrderB = Number.MAX_VALUE;
        }

        if (sortOrderA !== sortOrderB) {
          return (sortOrderA > sortOrderB ? 1 : -1);
        }

        // Final sort by label

        const labelA = formatRecordTypeLabel(nameA, configA);
        const labelB = formatRecordTypeLabel(nameB, configB);

        // FIXME: This should be locale aware
        return labelA.localeCompare(labelB);
      });

    const options = sortedRecordTypeNames.map((name, index) => {
      const recordType = recordTypes[name];
      const prevRecordType = (index === 0) ? null : recordTypes[sortedRecordTypeNames[index - 1]];

      return {
        value: name,
        label: formatRecordTypeLabel(name, recordType),
        startGroup: !prevRecordType || (recordType.group !== prevRecordType.group),
      };
    });

    let value = recordTypeValue;

    if (!value) {
      for (let i = 0; i < sortedRecordTypeNames.length; i += 1) {
        const recordTypeName = sortedRecordTypeNames[i];
        const recordType = recordTypes[recordTypeName];

        if (recordType.defaultForSearch) {
          value = recordTypeName;
          break;
        }
      }

      if (!value && options.length > 0) {
        value = options[0].value;
      }
    }

    return (
      <OptionListControlledInput
        blankable={false}
        embedded
        options={options}
        value={value}
        onCommit={this.handleRecordTypeDropdownCommit}
        onMount={this.handleRecordTypeDropdownMount}
      />
    );
  }

  renderVocabularyDropdown() {
    const {
      formatVocabularyLabel,
      recordTypes,
      recordTypeValue,
      vocabularyGroupOrder,
      vocabularyValue,
    } = this.props;

    if (
      !recordTypeValue ||
      !recordTypes[recordTypeValue] ||
      !recordTypes[recordTypeValue].vocabularies
    ) {
      return null;
    }

    const vocabularies = recordTypes[recordTypeValue].vocabularies;

    const sortedVocabularyNames = Object.keys(vocabularies)
      .sort((nameA, nameB) => {
        const configA = vocabularies[nameA];
        const configB = vocabularies[nameB];

        // Primary sort by group

        const groupA = configA.group;
        const groupB = configB.group;

        if (groupA !== groupB) {
          let groupOrderA = vocabularyGroupOrder[groupA];
          let groupOrderB = vocabularyGroupOrder[groupB];

          if (isNaN(groupOrderA)) {
            groupOrderA = Number.MAX_VALUE;
          }

          if (isNaN(groupOrderB)) {
            groupOrderB = Number.MAX_VALUE;
          }

          if (groupOrderA !== groupOrderB) {
            return (groupOrderA > groupOrderB ? 1 : -1);
          }
        }

        // Secondary sort by sortOrder

        let sortOrderA = configA.sortOrder;
        let sortOrderB = configB.sortOrder;

        if (typeof sortOrderA !== 'number') {
          sortOrderA = Number.MAX_VALUE;
        }

        if (typeof sortOrderB !== 'number') {
          sortOrderB = Number.MAX_VALUE;
        }

        if (sortOrderA !== sortOrderB) {
          return (sortOrderA > sortOrderB ? 1 : -1);
        }

        // Final sort by label

        const labelA = formatVocabularyLabel(nameA, configA);
        const labelB = formatVocabularyLabel(nameB, configB);

        // FIXME: This should be locale aware
        return labelA.localeCompare(labelB);
      });

    const options = sortedVocabularyNames.map((name, index) => {
      const vocabulary = vocabularies[name];
      const prevVocabulary = (index === 0) ? null : vocabularies[sortedVocabularyNames[index - 1]];

      return {
        value: name,
        label: formatVocabularyLabel(name, vocabulary),
        startGroup: !prevVocabulary || (vocabulary.group !== prevVocabulary.group),
      };
    });

    let value = vocabularyValue;

    if (!value) {
      for (let i = 0; i < sortedVocabularyNames.length; i += 1) {
        const vocabularyName = sortedVocabularyNames[i];
        const vocabulary = vocabularies[vocabularyName];

        if (vocabulary.defaultForSearch) {
          value = vocabularyName;
          break;
        }
      }

      if (!value && options.length > 0) {
        value = options[0].value;
      }
    }

    return (
      <OptionListControlledInput
        blankable={false}
        embedded
        options={options}
        value={value}
        onCommit={this.handleVocabularyDropdownCommit}
        onMount={this.handleVocabularyDropdownMount}
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
        onKeyPress={this.handleKeywordInputKeyPress}
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

KeywordSearchInput.propTypes = propTypes;
KeywordSearchInput.defaultProps = defaultProps;
