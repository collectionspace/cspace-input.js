import React, { PropTypes } from 'react';
import BasePrefixFilteringDropdownMenuInput from './PrefixFilteringDropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';

const PrefixFilteringDropdownMenuInput = withLabeledOptions(BasePrefixFilteringDropdownMenuInput);

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  indentItems: PropTypes.bool,
  recordTypes: PropTypes.object,
  rootType: PropTypes.string,
  serviceTypes: PropTypes.arrayOf(PropTypes.string),
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
  indentItems: true,
  recordTypes: {},
  rootType: 'all',
  serviceTypes: ['object', 'procedure', 'authority'],
};

export default function RecordTypeInput(props) {
  const {
    formatRecordTypeLabel,
    indentItems,
    recordTypes,
    rootType,
    serviceTypes,
    value: recordTypeValue,
    ...remainingProps
  } = props;

  const options = [];

  if (recordTypes[rootType]) {
    options.push({
      value: rootType,
      label: formatRecordTypeLabel(rootType, recordTypes[rootType]),
    });
  }

  serviceTypes.forEach((serviceType) => {
    const recordTypeNames = Object.keys(recordTypes)
      .filter(recordTypeName =>
        recordTypes[recordTypeName].serviceConfig.serviceType === serviceType)
      .sort((nameA, nameB) => {
        const configA = recordTypes[nameA];
        const configB = recordTypes[nameB];

        // Primary sort by sortOrder

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

        // Secondary sort by label

        const labelA = formatRecordTypeLabel(nameA, configA);
        const labelB = formatRecordTypeLabel(nameB, configB);

        // FIXME: This should be locale aware
        return labelA.localeCompare(labelB);
      });

    let indent = 0;

    if (recordTypeNames.length > 1 && recordTypes[serviceType]) {
      // If there is more than one record type within this service type, and the service type is
      // itself a record type, add the service type as a parent option.

      if (indentItems) {
        indent += 1;
      }

      options.push({
        indent,
        value: serviceType,
        label: formatRecordTypeLabel(serviceType, recordTypes[serviceType]),
      });
    }

    if (indentItems) {
      indent += 1;
    }

    recordTypeNames.forEach((recordTypeName) => {
      options.push({
        indent,
        value: recordTypeName,
        label: formatRecordTypeLabel(recordTypeName, recordTypes[recordTypeName]),
      });
    });
  });

  let value = recordTypeValue;

  if (!value) {
    for (let i = 0; i < options.length; i += 1) {
      const recordTypeName = options[i].value;
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
