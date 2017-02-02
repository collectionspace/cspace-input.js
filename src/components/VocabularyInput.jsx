import React, { PropTypes } from 'react';
import BasePrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';

const PrefixFilteringDropdownMenuInput = withLabeledOptions(BasePrefixFilteringDropdownMenuInput);

const propTypes = {
  formatVocabularyLabel: PropTypes.func,
  recordTypes: PropTypes.object,
  recordType: PropTypes.string,
  value: PropTypes.string,
  vocabularyTypeOrder: PropTypes.object,
};

const defaultProps = {
  formatVocabularyLabel: (name, config) => {
    const messages = config.messages;

    if (messages) {
      return messages.name.defaultMessage;
    }

    return name;
  },
  vocabularyTypeOrder: {
    all: 0,
  },
};

export default function VocabularyInput(props) {
  const {
    formatVocabularyLabel,
    recordTypes,
    recordType,
    vocabularyTypeOrder,
    value: vocabularyValue,
    ...remainingProps
  } = props;

  if (
    !recordType ||
    !recordTypes[recordType] ||
    !recordTypes[recordType].vocabularies
  ) {
    return null;
  }

  const vocabularies = recordTypes[recordType].vocabularies;

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
      options={options}
      value={value}
      {...remainingProps}
    />
  );
}

VocabularyInput.propTypes = propTypes;
VocabularyInput.defaultProps = defaultProps;
