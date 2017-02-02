import React, { PropTypes } from 'react';
import BasePrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';

const PrefixFilteringDropdownMenuInput = withLabeledOptions(BasePrefixFilteringDropdownMenuInput);

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  recordTypes: PropTypes.object,
  serviceTypeOrder: PropTypes.object,
  value: PropTypes.string,
};

const defaultProps = {
  formatRecordTypeLabel: (name, config) => {
    const messages = config.messages;

    if (messages) {
      return messages.record.collectionName.defaultMessage;
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
};

export default function RecordTypeInput(props) {
  const {
    formatRecordTypeLabel,
    recordTypes,
    serviceTypeOrder,
    value: recordTypeValue,
    ...remainingProps
  } = props;

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
      options={options}
      value={value}
      {...remainingProps}
    />
  );
}

RecordTypeInput.propTypes = propTypes;
RecordTypeInput.defaultProps = defaultProps;
