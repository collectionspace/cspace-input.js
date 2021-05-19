import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseSubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import BaseDropdownMenuInput from './DropdownMenuInput';
import withLabeledOptions from '../enhancers/withLabeledOptions';
import { getPath } from '../helpers/pathHelpers';

const propTypes = {
  formatRecordTypeLabel: PropTypes.func,
  indentItems: PropTypes.bool,
  recordTypes: PropTypes.objectOf(PropTypes.object),
  rootType: PropTypes.string,
  serviceTypes: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  filtering: PropTypes.bool,
};

const defaultProps = {
  filtering: true,
  formatRecordTypeLabel: (name, config) => {
    const { messages } = config;

    if (messages) {
      return messages.record.collectionName.defaultMessage;
    }

    return name;
  },
  indentItems: true,
  recordTypes: {},
  rootType: 'all',
  serviceTypes: ['object', 'procedure', 'authority'],
  value: undefined,
};

const SubstringFilteringDropdownMenuInput = withLabeledOptions(
  BaseSubstringFilteringDropdownMenuInput,
);

const DropdownMenuInput = withLabeledOptions(
  BaseDropdownMenuInput,
);

export default class RecordTypeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.initOptions(this.props);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      formatRecordTypeLabel,
      indentItems,
      recordTypes,
      rootType,
      serviceTypes,
    } = this.props;

    const {
      formatRecordTypeLabel: nextFormatRecordTypeLabel,
      indentItems: nextIndentItems,
      recordTypes: nextRecordTypes,
      rootType: nextRootType,
      serviceTypes: nextServiceTypes,
    } = nextProps;

    if (
      formatRecordTypeLabel !== nextFormatRecordTypeLabel
      || indentItems !== nextIndentItems
      || recordTypes !== nextRecordTypes
      || rootType !== nextRootType
      || serviceTypes !== nextServiceTypes
    ) {
      this.initOptions(nextProps);
    }
  }

  initOptions(props) {
    const {
      formatRecordTypeLabel,
      indentItems,
      recordTypes,
      rootType,
      serviceTypes,
      value,
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
        .filter((recordTypeName) => {
          const recordTypeConfig = recordTypes[recordTypeName];

          return (
            recordTypeConfig
            && recordTypeConfig.serviceConfig.serviceType === serviceType
            && !recordTypeConfig.disabled
          );
        })
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

    this.setState({
      options,
    });

    if (typeof value === 'undefined') {
      let defaultValue;

      for (let i = 0; i < options.length; i += 1) {
        const recordTypeName = options[i].value;
        const recordType = recordTypes[recordTypeName];

        if (recordType.defaultForSearch) {
          defaultValue = recordTypeName;
          break;
        }
      }

      if (!defaultValue && options.length > 0) {
        defaultValue = options[0].value;
      }

      if (defaultValue) {
        const { onCommit } = props;

        if (onCommit) {
          onCommit(getPath(props), defaultValue);
        }
      }
    }
  }

  render() {
    const {
      filtering,
      formatRecordTypeLabel,
      indentItems,
      recordTypes,
      rootType,
      serviceTypes,
      ...remainingProps
    } = this.props;

    const {
      options,
    } = this.state;

    const Input = filtering ? SubstringFilteringDropdownMenuInput : DropdownMenuInput;

    return (
      <Input
        blankable={false}
        options={options}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
      />
    );
  }
}

RecordTypeInput.propTypes = propTypes;
RecordTypeInput.defaultProps = defaultProps;
