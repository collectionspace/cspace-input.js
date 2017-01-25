import React, { Component, PropTypes } from 'react';
import BaseLineInput from './LineInput';
import BasePrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import withLabeledOptions from '../enhancers/withLabeledOptions';
import styles from '../../styles/cspace-input/KeywordSearchInput.css';

const LineInput = committable(changeable(BaseLineInput));
const PrefixFilteringDropdownMenuInput = withLabeledOptions(BasePrefixFilteringDropdownMenuInput);

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  formatVocabularyLabel: PropTypes.func,
  keywordValue: PropTypes.string,
  placeholder: PropTypes.string,
  recordTypes: PropTypes.object,
  serviceTypeOrder: PropTypes.object,
  recordTypeValue: PropTypes.string,
  vocabularyTypeOrder: PropTypes.object,
  vocabularyValue: PropTypes.string,
  onSearch: PropTypes.func,
  onKeywordCommit: PropTypes.func,
  onRecordTypeCommit: PropTypes.func,
  onVocabularyCommit: PropTypes.func,
};

const defaultProps = {
  formatRecordTypeLabel: (name, config) => {
    const messages = config.messages;

    if (messages) {
      return messages.record.recordNameTitle.defaultMessage;
    }

    return name;
  },
  formatVocabularyLabel: (name, config) => {
    const messages = config.messages;

    if (messages) {
      return messages.vocabNameTitle.defaultMessage;
    }

    return name;
  },
  recordTypes: {},
  serviceTypeOrder: {
    utility: 0,
    object: 1,
    procedure: 2,
    authority: 3,
  },
  vocabularyTypeOrder: {
    all: 0,
  },
};

export default class KeywordSearchInput extends Component {
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
      serviceTypeOrder,
    } = this.props;

    const sortedRecordTypeNames = Object.keys(recordTypes)
      .sort((nameA, nameB) => {
        const configA = recordTypes[nameA];
        const configB = recordTypes[nameB];

        // Primary sort by service type

        const serviceTypeA = configA.serviceConfig.serviceType;
        const serviceTypeB = configB.serviceConfig.serviceType;

        if (serviceTypeA !== serviceTypeB) {
          let serviceTypeOrderA = serviceTypeOrder[serviceTypeA];
          let serviceTypeOrderB = serviceTypeOrder[serviceTypeB];

          if (isNaN(serviceTypeOrderA)) {
            serviceTypeOrderA = Number.MAX_VALUE;
          }

          if (isNaN(serviceTypeOrderB)) {
            serviceTypeOrderB = Number.MAX_VALUE;
          }

          if (serviceTypeOrderA !== serviceTypeOrderB) {
            return (serviceTypeOrderA > serviceTypeOrderB ? 1 : -1);
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
        startGroup: !prevRecordType ||
          (recordType.serviceConfig.serviceType !== prevRecordType.serviceConfig.serviceType),
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
      <PrefixFilteringDropdownMenuInput
        blankable={false}
        embedded
        options={options}
        value={value}
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
      vocabularyTypeOrder,
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

        const vocabularyTypeA = configA.type;
        const vocabularyTypeB = configB.type;

        if (vocabularyTypeA !== vocabularyTypeB) {
          let vocabularyTypeOrderA = vocabularyTypeOrder[vocabularyTypeA];
          let vocabularyTypeOrderB = vocabularyTypeOrder[vocabularyTypeB];

          if (isNaN(vocabularyTypeOrderA)) {
            vocabularyTypeOrderA = Number.MAX_VALUE;
          }

          if (isNaN(vocabularyTypeOrderB)) {
            vocabularyTypeOrderB = Number.MAX_VALUE;
          }

          if (vocabularyTypeOrderA !== vocabularyTypeOrderB) {
            return (vocabularyTypeOrderA > vocabularyTypeOrderB ? 1 : -1);
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
        startGroup: !prevVocabulary || (vocabulary.type !== prevVocabulary.type),
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
      <PrefixFilteringDropdownMenuInput
        blankable={false}
        embedded
        options={options}
        value={value}
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

KeywordSearchInput.propTypes = propTypes;
KeywordSearchInput.defaultProps = defaultProps;
