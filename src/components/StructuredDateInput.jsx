import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Row } from 'cspace-layout';
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
import styles from '../../styles/cspace-input/StructuredDateInput.css';

const DropdownInput = committable(changeable(BaseDropdownInput));
const TextInput = committable(changeable(BaseTextInput));
const LabelableTextInput = labelable(TextInput);

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
  formatFieldLabel: PropTypes.func,
  name: PropTypes.string,
  optionLists: PropTypes.object,
  parentPath: pathPropType,
  subpath: pathPropType,
  terms: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.object,          // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
  onCommit: PropTypes.func,
};

const defaultProps = {
  formatFieldLabel: id => fieldLabels[id],
  optionLists: {},
  terms: {},
};

export default class StructuredDateInput extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputCommit = this.handleInputCommit.bind(this);
    this.handlePrimaryInputCommit = this.handlePrimaryInputCommit.bind(this);
  }

  getValue(name) {
    const {
      value,
    } = this.props;

    if (!value) {
      return undefined;
    }

    if (Immutable.Map.isMap(value)) {
      return value.get(name);
    }

    return value[name];
  }
  
  setValue(name, value) {
    let {
      value: structuredDateValue,
    } = this.props;

    if (!structuredDateValue) {
      structuredDateValue = {};
    }

    if (Immutable.Map.isMap(structuredDateValue)) {
      return structuredDateValue.set(name, value);
    }

    return Object.assign({}, structuredDateValue, { [name]: value});
  }

  handlePrimaryInputCommit(path, value) {
    this.handleInputCommit(path.concat('dateDisplayDate'), value);
  }

  handleInputCommit(path, value) {
    const name = path[path.length - 1];

    const {
      onCommit,
    } = this.props;
    
    if (onCommit) {
      onCommit(getPath(this.props), this.setValue(name, value));
    }
  }

  render() {
    const {
      formatFieldLabel,
      optionLists,
      terms,
      value,
    } = this.props;

    return (
      <DropdownInput
        className={styles.normal}
        openOnFocus
        value={this.getValue('dateDisplayDate')}
        onCommit={this.handlePrimaryInputCommit}
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
                <th></th>
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
                    onCommit={this.handleInputCommit
                  }/>
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
                    terms={terms.dateEra}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <VocabularyControlledInput
                    embedded
                    name="dateEarliestSingleCertainty"
                    terms={terms.dateCertainty}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <OptionListControlledInput
                    embedded
                    name="dateEarliestSingleQualifier"
                    options={optionLists.dateQualifier}
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
                    terms={terms.dateQualifierUnit}
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
                    terms={terms.dateEra}
                    value={this.getValue('dateLatestEra')}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <VocabularyControlledInput
                    embedded
                    name="dateLatestCertainty"
                    terms={terms.dateCertainty}
                    value={this.getValue('dateLatestCertainty')}
                    onCommit={this.handleInputCommit}
                  />
                </td>
                <td>
                  <OptionListControlledInput
                    embedded
                    name="dateLatestQualifier"
                    options={optionLists.dateQualifier}
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
                    terms={terms.dateQualifierUnit}
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
