import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Row from 'cspace-layout/lib/components/Row';
import set from 'lodash/set';
import merge from 'lodash/merge';
import CustomCompoundInput from './CustomCompoundInput';
import BaseDropdownInput from './DropdownInput';
import Label from './Label';
import BaseTextInput from './TextInput';
import BaseSubstringFilteringDropdownMenuInput from './SubstringFilteringDropdownMenuInput';
import TermPickerInput from './TermPickerInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import withLabeledOptions from '../enhancers/withLabeledOptions';
import labelable from '../enhancers/labelable';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import { computeEarliestScalarDate, computeLatestScalarDate } from '../helpers/dateHelpers';
import styles from '../../styles/cspace-input/StructuredDateInput.css';
import messageStyles from '../../styles/cspace-input/Message.css';

const fieldLabels = {
  earliestSingle: 'Earliest/Single',
  latest: 'Latest',
  datePeriod: 'Period',
  dateAssociation: 'Association',
  dateNote: 'Note',
  dateYear: 'Year',
  dateMonth: 'Month',
  dateDay: 'Day',
  dateEra: 'Era',
  dateCertainty: 'Certainty',
  dateQualifier: 'Qualifier',
  dateQualifierValue: 'Value',
  dateQualifierUnit: 'Unit',
};

const propTypes = {
  defaultValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Immutable.Map),
  ]),
  embedded: PropTypes.bool,
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  optionLists: PropTypes.objectOf(PropTypes.array),
  parentPath: pathPropType,
  subpath: pathPropType,
  // eslint-disable-next-line react/forbid-prop-types
  terms: PropTypes.objectOf(PropTypes.array),
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Immutable.Map),
  ]),
  readOnly: PropTypes.bool,
  formatFieldLabel: PropTypes.func,
  formatOptionLabel: PropTypes.func,
  formatParseFailedMessage: PropTypes.func,
  parseDisplayDate: PropTypes.func,
  onCommit: PropTypes.func,
  onMount: PropTypes.func,
};

const defaultProps = {
  defaultValue: {},
  embedded: undefined,
  formatFieldLabel: (name) => fieldLabels[name],
  formatOptionLabel: undefined,
  formatParseFailedMessage: () => 'Unrecognized display date format. Try a different format, or enter values in the fields below.',
  name: undefined,
  onCommit: undefined,
  onMount: undefined,
  parentPath: undefined,
  parseDisplayDate: undefined,
  optionLists: {},
  readOnly: undefined,
  subpath: undefined,
  terms: {},
  value: undefined,
};

const DropdownInput = committable(changeable(BaseDropdownInput));
const TextInput = committable(changeable(BaseTextInput));
const LabelableTextInput = labelable(TextInput);
const LabelableTermPickerInput = labelable(TermPickerInput);

const SubstringFilteringDropdownMenuInput = withLabeledOptions(
  BaseSubstringFilteringDropdownMenuInput,
);

const LabelableSubstringFilteringDropdownMenuInput = labelable(SubstringFilteringDropdownMenuInput);

const primaryFieldName = 'dateDisplayDate';

const getStructDateFieldValue = (structDateValue, fieldName) => {
  if (!structDateValue) {
    return undefined;
  }

  if (Immutable.Map.isMap(structDateValue)) {
    return structDateValue.get(fieldName);
  }

  return structDateValue[fieldName];
};

const getPrimaryValue = (structDateValue) => getStructDateFieldValue(
  structDateValue,
  primaryFieldName,
);

export default class StructuredDateInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.handleInputCommit = this.handleInputCommit.bind(this);
    this.handlePrimaryInputChange = this.handlePrimaryInputChange.bind(this);
    this.handlePrimaryInputCommit = this.handlePrimaryInputCommit.bind(this);

    const value = props.value || props.defaultValue;

    this.state = {
      value,
      open: false,
      primaryValue: getPrimaryValue(value),
    };
  }

  componentDidMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const value = nextProps.value || nextProps.defaultValue;

    this.setState({
      value,
      primaryValue: getPrimaryValue(value),
    });
  }

  handleDropdownInputClose() {
    this.setState({
      open: false,
    });
  }

  handleDropdownInputOpen() {
    this.setState({
      open: true,
    });
  }

  handleInputCommit(path, value) {
    const nextStructDateValue = this.setValue(path, value);

    const {
      onCommit,
      parseDisplayDate,
    } = this.props;

    const {
      value: prevStructDateValue,
    } = this.state;

    if (onCommit) {
      onCommit(getPath(this.props), nextStructDateValue);
    }

    if (parseDisplayDate) {
      const prevDisplayDate = getStructDateFieldValue(prevStructDateValue, 'dateDisplayDate');
      const nextDisplayDate = getStructDateFieldValue(nextStructDateValue, 'dateDisplayDate');

      if (nextDisplayDate !== prevDisplayDate) {
        this.setState({
          parseFailed: false,
        });

        parseDisplayDate(nextDisplayDate)
          .then((result) => {
            if (!result || result.isError) {
              this.setState({
                parseFailed: true,
              });
            } else {
              this.handleInputCommit([], result.value);
            }
          });
      }
    }

    this.setState({
      value: nextStructDateValue,
    });
  }

  handlePrimaryInputCommit(path, value) {
    const initialValue = this.getValue(primaryFieldName);

    if (
      (value || initialValue)
      && (value !== initialValue)
    ) {
      this.handleInputCommit([primaryFieldName], value);
    }
  }

  handlePrimaryInputChange(value) {
    this.setState({
      open: true,
      primaryValue: value,
    });
  }

  getValue(name) {
    const {
      value,
    } = this.state;

    return getStructDateFieldValue(value, name);
  }

  setValue(path, value) {
    const {
      value: structDateValue,
    } = this.state;

    let newStructDateValue;

    if (Immutable.Map.isMap(structDateValue)) {
      if (path.length === 0) {
        newStructDateValue = structDateValue.merge(value);
      } else {
        newStructDateValue = structDateValue.setIn(path, value);
      }

      const newStructDateValueAsObject = newStructDateValue.toJS();
      const dateEarliestScalarValue = computeEarliestScalarDate(newStructDateValueAsObject);
      const dateLatestScalarValue = computeLatestScalarDate(newStructDateValueAsObject);

      newStructDateValue = newStructDateValue.set('dateEarliestScalarValue', dateEarliestScalarValue);
      newStructDateValue = newStructDateValue.set('dateLatestScalarValue', dateLatestScalarValue);
      newStructDateValue = newStructDateValue.set('scalarValuesComputed', true);
    } else {
      if (path.length === 0) {
        newStructDateValue = merge(structDateValue, value);
      } else {
        newStructDateValue = merge({}, structDateValue);

        set(newStructDateValue, path, value);
      }

      const dateEarliestScalarValue = computeEarliestScalarDate(newStructDateValue);
      const dateLatestScalarValue = computeLatestScalarDate(newStructDateValue);

      newStructDateValue.dateEarliestScalarValue = dateEarliestScalarValue;
      newStructDateValue.dateLatestScalarValue = dateLatestScalarValue;
      newStructDateValue.scalarValuesComputed = true;
    }

    return newStructDateValue;
  }

  renderParseFailedMessage() {
    const {
      parseFailed,
    } = this.state;

    if (!parseFailed) {
      return null;
    }

    const {
      formatParseFailedMessage,
    } = this.props;

    return (
      <div className={messageStyles.warning}>{formatParseFailedMessage()}</div>
    );
  }

  renderDropdownInput(fieldName, listName, embedded = false) {
    // Render an appropriate dropdown input for the given list name. If the name is the name of a
    // term list provided in the terms prop, a TermPickerInput is rendered. Otherwise, if the name
    // is the name of an option list provided in the optionLists prop, a
    // SubstringFilteringDropdownMenuInput is rendered.

    const {
      formatFieldLabel,
      formatOptionLabel,
      optionLists,
      terms,
    } = this.props;

    const matchingTermList = terms[listName];

    if (matchingTermList) {
      if (embedded) {
        return (
          <TermPickerInput
            embedded
            name={fieldName}
            terms={matchingTermList}
            onCommit={this.handleInputCommit}
          />
        );
      }

      return (
        <LabelableTermPickerInput
          label={formatFieldLabel(fieldName)}
          name={fieldName}
          terms={matchingTermList}
          onCommit={this.handleInputCommit}
        />
      );
    }

    const matchingOptionList = optionLists[listName];

    if (matchingOptionList) {
      if (embedded) {
        return (
          <SubstringFilteringDropdownMenuInput
            embedded
            formatOptionLabel={formatOptionLabel}
            name={fieldName}
            options={matchingOptionList}
            onCommit={this.handleInputCommit}
          />
        );
      }

      return (
        <LabelableSubstringFilteringDropdownMenuInput
          formatOptionLabel={formatOptionLabel}
          label={formatFieldLabel(fieldName)}
          name={fieldName}
          options={matchingOptionList}
          onCommit={this.handleInputCommit}
        />
      );
    }

    if (embedded) {
      return (
        <TextInput
          embedded
          name={fieldName}
          onCommit={this.handleInputCommit}
        />
      );
    }

    return (
      <LabelableTextInput
        name={fieldName}
        label={formatFieldLabel(fieldName)}
        onCommit={this.handleInputCommit}
      />
    );
  }

  render() {
    const {
      defaultValue,
      formatFieldLabel,
      formatOptionLabel,
      formatParseFailedMessage,
      name,
      optionLists,
      parentPath,
      subpath,
      terms,
      value: valueProp,
      onCommit,
      onMount,
      parseDisplayDate,
      ...remainingProps
    } = this.props;

    const {
      readOnly,
    } = remainingProps;

    const {
      open,
      primaryValue,
      value,
    } = this.state;

    return (
      <DropdownInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
        className={readOnly ? styles.readOnly : styles.normal}
        commitUnchanged
        open={open}
        value={primaryValue}
        isOpenableWhenReadOnly
        onChange={this.handlePrimaryInputChange}
        onClose={this.handleDropdownInputClose}
        onCommit={this.handlePrimaryInputCommit}
        onOpen={this.handleDropdownInputOpen}
      >
        <CustomCompoundInput readOnly={readOnly} value={value}>
          <Row>
            <div>
              <LabelableTextInput
                name="datePeriod"
                label={formatFieldLabel('datePeriod')}
                onCommit={this.handleInputCommit}
              />
            </div>

            <div>
              {this.renderDropdownInput('dateAssociation', 'dateassociation')}
            </div>

            <div>
              <LabelableTextInput
                name="dateNote"
                label={formatFieldLabel('dateNote')}
                onCommit={this.handleInputCommit}
              />
            </div>
          </Row>

          {this.renderParseFailedMessage()}

          <table>
            <thead>
              <tr>
                <td />
                <th><Label>{formatFieldLabel('dateYear')}</Label></th>
                <th><Label>{formatFieldLabel('dateMonth')}</Label></th>
                <th><Label>{formatFieldLabel('dateDay')}</Label></th>
                <th><Label>{formatFieldLabel('dateEra')}</Label></th>
                <th><Label>{formatFieldLabel('dateCertainty')}</Label></th>
                <th><Label>{formatFieldLabel('dateQualifier')}</Label></th>
                <th><Label>{formatFieldLabel('dateQualifierValue')}</Label></th>
                <th><Label>{formatFieldLabel('dateQualifierUnit')}</Label></th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th><Label>{formatFieldLabel('earliestSingle')}</Label></th>

                <td>
                  <TextInput
                    embedded
                    name="dateEarliestSingleYear"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateEarliestSingleMonth"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateEarliestSingleDay"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  {this.renderDropdownInput('dateEarliestSingleEra', 'dateera', true)}
                </td>

                <td>
                  {this.renderDropdownInput('dateEarliestSingleCertainty', 'datecertainty', true)}
                </td>

                <td>
                  {this.renderDropdownInput('dateEarliestSingleQualifier', 'dateQualifiers', true)}
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateEarliestSingleQualifierValue"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  {this.renderDropdownInput('dateEarliestSingleQualifierUnit', 'datequalifier', true)}
                </td>
              </tr>

              <tr>
                <th><Label>{formatFieldLabel('latest')}</Label></th>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestYear"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestMonth"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestDay"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  {this.renderDropdownInput('dateLatestEra', 'dateera', true)}
                </td>

                <td>
                  {this.renderDropdownInput('dateLatestCertainty', 'datecertainty', true)}
                </td>

                <td>
                  {this.renderDropdownInput('dateLatestQualifier', 'dateQualifiers', true)}
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestQualifierValue"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  {this.renderDropdownInput('dateLatestQualifierUnit', 'datequalifier', true)}
                </td>
              </tr>
            </tbody>
          </table>
        </CustomCompoundInput>
      </DropdownInput>
    );
  }
}

StructuredDateInput.propTypes = propTypes;
StructuredDateInput.defaultProps = defaultProps;
