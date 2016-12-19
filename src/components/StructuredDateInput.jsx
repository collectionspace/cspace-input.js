import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Row } from 'cspace-layout';
import set from 'lodash/set';
import merge from 'lodash/merge';
import CustomCompoundInput from './CustomCompoundInput';
import BaseDropdownInput from './DropdownInput';
import Label from './Label';
import OptionListControlledInput from './OptionListControlledInput';
import BaseTextInput from './TextInput';
import VocabularyControlledInput from './VocabularyControlledInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import labelable from '../enhancers/labelable';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import { computeEarliestScalarDate, computeLatestScalarDate } from '../helpers/dateHelpers';
import styles from '../../styles/cspace-input/StructuredDateInput.css';

const DropdownInput = committable(changeable(BaseDropdownInput));
const TextInput = committable(changeable(BaseTextInput));
const LabelableTextInput = labelable(TextInput);

const primaryFieldName = 'dateDisplayDate';

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
  formatFieldLabel: PropTypes.func,
  formatOptionLabel: PropTypes.func,
  name: PropTypes.string,
  optionLists: PropTypes.object,
  parentPath: pathPropType,
  subpath: pathPropType,
  terms: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
  onCommit: PropTypes.func,
  onMount: PropTypes.func,
};

const defaultProps = {
  defaultValue: {},
  formatFieldLabel: name => fieldLabels[name],
  optionLists: {},
  terms: {},
};

export default class StructuredDateInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.handleInputCommit = this.handleInputCommit.bind(this);
    this.handlePrimaryInputCommit = this.handlePrimaryInputCommit.bind(this);

    this.state = {
      open: false,
      value: props.value || props.defaultValue,
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
    this.setState({
      value: nextProps.value || nextProps.defaultValue,
    });
  }

  getValue(name) {
    const {
      value,
    } = this.state;

    if (!value) {
      return undefined;
    }

    if (Immutable.Map.isMap(value)) {
      return value.get(name);
    }

    return value[name];
  }

  setValue(path, value) {
    const {
      value: structDateValue,
    } = this.state;

    let newStructDateValue;

    if (Immutable.Map.isMap(structDateValue)) {
      newStructDateValue = structDateValue.setIn(path, value);

      const newStructDateValueAsObject = newStructDateValue.toJS();
      const dateEarliestScalarValue = computeEarliestScalarDate(newStructDateValueAsObject);
      const dateLatestScalarValue = computeLatestScalarDate(newStructDateValueAsObject);

      newStructDateValue = newStructDateValue.set('dateEarliestScalarValue', dateEarliestScalarValue);
      newStructDateValue = newStructDateValue.set('dateLatestScalarValue', dateLatestScalarValue);
      newStructDateValue = newStructDateValue.set('scalarValuesComputed', true);
    } else {
      newStructDateValue = merge({}, structDateValue);
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
    const newStructDateValue = this.setValue(path, value);

    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), newStructDateValue);
    }

    this.setState({
      value: newStructDateValue,
    });
  }

  handlePrimaryInputCommit(path, value) {
    this.handleInputCommit([primaryFieldName], value);
  }

  render() {
    const {
      formatFieldLabel,
      formatOptionLabel,
      optionLists,
      terms,
      /* eslint-disable no-unused-vars */
      defaultValue,
      name,
      parentPath,
      subpath,
      value: valueProp,
      onCommit,
      onMount,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      open,
      value,
    } = this.state;

    return (
      <DropdownInput
        {...remainingProps}
        className={styles.normal}
        open={open}
        openOnKeyDown
        value={this.getValue(primaryFieldName)}
        onClose={this.handleDropdownInputClose}
        onCommit={this.handlePrimaryInputCommit}
        onOpen={this.handleDropdownInputOpen}
      >
        <CustomCompoundInput value={value}>
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
                  <VocabularyControlledInput
                    embedded
                    name="dateEarliestSingleEra"
                    terms={terms.dateera}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <VocabularyControlledInput
                    embedded
                    name="dateEarliestSingleCertainty"
                    terms={terms.datecertainty}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <OptionListControlledInput
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
                  <VocabularyControlledInput
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
                  <VocabularyControlledInput
                    embedded
                    name="dateLatestEra"
                    terms={terms.dateera}
                    value={this.getValue('dateLatestEra')}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <VocabularyControlledInput
                    embedded
                    name="dateLatestCertainty"
                    terms={terms.datecertainty}
                    value={this.getValue('dateLatestCertainty')}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <OptionListControlledInput
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
                  <VocabularyControlledInput
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
