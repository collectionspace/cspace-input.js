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

const DropdownInput = committable(changeable(BaseDropdownInput));
const TextInput = committable(changeable(BaseTextInput));
const LabelableTextInput = labelable(TextInput);

const SubstringFilteringDropdownMenuInput =
  withLabeledOptions(BaseSubstringFilteringDropdownMenuInput);

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

const getPrimaryValue = structDateValue =>
  getStructDateFieldValue(structDateValue, primaryFieldName);

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
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
  embedded: PropTypes.bool,
  name: PropTypes.string,
  optionLists: PropTypes.object,
  parentPath: pathPropType,
  subpath: pathPropType,
  terms: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
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
  formatFieldLabel: name => fieldLabels[name],
  formatParseFailedMessage: () => 'Unrecognized display date format. Try a different format, or enter values in the fields below.',
  optionLists: {},
  terms: {},
};

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

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value || nextProps.defaultValue;

    this.setState({
      value,
      primaryValue: getPrimaryValue(value),
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
        newStructDateValue = value;
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
        newStructDateValue = value;
      } else {
        newStructDateValue = merge({}, structDateValue);
      }

      set(newStructDateValue, path, value);

      const dateEarliestScalarValue = computeEarliestScalarDate(newStructDateValue);
      const dateLatestScalarValue = computeLatestScalarDate(newStructDateValue);

      newStructDateValue.dateEarliestScalarValue = dateEarliestScalarValue;
      newStructDateValue.dateLatestScalarValue = dateLatestScalarValue;
      newStructDateValue.scalarValuesComputed = true;
    }

    return newStructDateValue;
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

    if (onCommit) {
      onCommit(getPath(this.props), nextStructDateValue);
    }

    if (parseDisplayDate) {
      const prevDisplayDate = getStructDateFieldValue(this.state.value, 'dateDisplayDate');
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
      (value || initialValue) &&
      (value !== initialValue)
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

  render() {
    const {
      formatFieldLabel,
      formatOptionLabel,
      optionLists,
      terms,
      readOnly,
      /* eslint-disable no-unused-vars */
      defaultValue,
      formatParseFailedMessage,
      name,
      parentPath,
      subpath,
      value: valueProp,
      onCommit,
      onMount,
      parseDisplayDate,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      open,
      primaryValue,
      value,
    } = this.state;

    return (
      <DropdownInput
        {...remainingProps}
        className={readOnly ? styles.readOnly : styles.normal}
        commitUnchanged
        open={open}
        value={primaryValue}
        readOnly={readOnly}
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
              <LabelableTextInput
                name="dateAssociation"
                label={formatFieldLabel('dateAssociation')}
                onCommit={this.handleInputCommit}
              />
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
                <th />
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
                  <TermPickerInput
                    embedded
                    name="dateEarliestSingleEra"
                    terms={terms.dateera}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TermPickerInput
                    embedded
                    name="dateEarliestSingleCertainty"
                    terms={terms.datecertainty}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <SubstringFilteringDropdownMenuInput
                    embedded
                    formatOptionLabel={formatOptionLabel}
                    name="dateEarliestSingleQualifier"
                    options={optionLists.dateQualifiers}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateEarliestSingleQualifierValue"
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TermPickerInput
                    embedded
                    name="dateEarliestSingleQualifierUnit"
                    terms={terms.datequalifier}
                    onCommit={this.handleInputCommit}
                  />
                </td>
              </tr>

              <tr>
                <th><Label>{formatFieldLabel('latest')}</Label></th>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestYear"
                    value={this.getValue('dateLatestYear')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestMonth"
                    value={this.getValue('dateLatestMonth')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestDay"
                    value={this.getValue('dateLatestDay')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TermPickerInput
                    embedded
                    name="dateLatestEra"
                    terms={terms.dateera}
                    value={this.getValue('dateLatestEra')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TermPickerInput
                    embedded
                    name="dateLatestCertainty"
                    terms={terms.datecertainty}
                    value={this.getValue('dateLatestCertainty')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <SubstringFilteringDropdownMenuInput
                    embedded
                    formatOptionLabel={formatOptionLabel}
                    name="dateLatestQualifier"
                    options={optionLists.dateQualifiers}
                    value={this.getValue('dateLatestQualifier')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TextInput
                    embedded
                    name="dateLatestQualifierValue"
                    value={this.getValue('dateLatestQualifierValue')}
                    onCommit={this.handleInputCommit}
                  />
                </td>

                <td>
                  <TermPickerInput
                    embedded
                    name="dateLatestQualifierUnit"
                    terms={terms.datequalifier}
                    value={this.getValue('dateLatestQualifierUnit')}
                    onCommit={this.handleInputCommit}
                  />
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
