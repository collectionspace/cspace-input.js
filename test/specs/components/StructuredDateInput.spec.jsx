/* global window */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import BaseStructuredDateInput from '../../../src/components/StructuredDateInput';
import createTestContainer from '../../helpers/createTestContainer';
import { isInput } from '../../../src/helpers/inputHelpers';
import labelable from '../../../src/enhancers/labelable';
import repeatable from '../../../src/enhancers/repeatable';

const StructuredDateInput = repeatable(labelable(BaseStructuredDateInput));
const { expect } = chai;

chai.use(chaiImmutable);
chai.should();

const optionLists = {
  dateQualifiers: [
    { value: 'qual1', label: 'Qual 1' },
    { value: 'qual2', label: 'Qual 2' },
    { value: 'qual3', label: 'Qual 3' },
  ],
};

const terms = {
  dateera: [
    { refName: 'era1', displayName: 'Era 1' },
    { refName: 'era2', displayName: 'Era 2' },
    { refName: 'era3', displayName: 'Era 3' },
  ],
  datecertainty: [
    { refName: 'certainty1', displayName: 'Certainty 1' },
    { refName: 'certainty2', displayName: 'Certainty 2' },
    { refName: 'certainty3', displayName: 'Certainty 3' },
  ],
  datequalifier: [
    { refName: 'unit1', displayName: 'Unit 1' },
    { refName: 'unit2', displayName: 'Unit 2' },
    { refName: 'unit3', displayName: 'Unit 3' },
  ],
};

describe('StructuredDateInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<StructuredDateInput />).should.equal(true);
  });

  it('should not open the dropdown when the primary input receives focus', function test() {
    render(<StructuredDateInput />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    expect(this.container.querySelector('table')).to.equal(null);
  });

  it('should call onMount when mounted', function test() {
    let handlerCalled = false;

    const handleMount = () => {
      handlerCalled = true;
    };

    render(<StructuredDateInput onMount={handleMount} />, this.container);

    handlerCalled.should.equal(true);
  });

  it('should accept an object value, and distribute values to nested inputs', function test() {
    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
      />, this.container,
    );

    let primaryInput;

    primaryInput = this.container.querySelector('input');
    primaryInput.value.should.equal('June 2003-February 2012');

    Simulate.mouseDown(primaryInput);

    this.container.querySelector('input[data-name=datePeriod]').value.should.equal(value.datePeriod);
    this.container.querySelector('input[data-name=dateAssociation]').value.should.equal(value.dateAssociation);
    this.container.querySelector('input[data-name=dateNote]').value.should.equal(value.dateNote);
    this.container.querySelector('input[data-name=dateEarliestSingleYear]').value.should.equal(value.dateEarliestSingleYear);
    this.container.querySelector('input[data-name=dateEarliestSingleMonth]').value.should.equal(value.dateEarliestSingleMonth);
    this.container.querySelector('input[data-name=dateEarliestSingleDay]').value.should.equal(value.dateEarliestSingleDay);
    this.container.querySelector('input[data-name=dateEarliestSingleEra]').value.should.equal('Era 1');
    this.container.querySelector('input[data-name=dateEarliestSingleCertainty]').value.should.equal('Certainty 1');
    this.container.querySelector('input[data-name=dateEarliestSingleQualifier]').value.should.equal('Qual 1');
    this.container.querySelector('input[data-name=dateEarliestSingleQualifierValue]').value.should.equal(value.dateEarliestSingleQualifierValue);
    this.container.querySelector('input[data-name=dateEarliestSingleQualifierUnit]').value.should.equal('Unit 1');
    this.container.querySelector('input[data-name=dateLatestYear]').value.should.equal(value.dateLatestYear);
    this.container.querySelector('input[data-name=dateLatestMonth]').value.should.equal(value.dateLatestMonth);
    this.container.querySelector('input[data-name=dateLatestDay]').value.should.equal(value.dateLatestDay);
    this.container.querySelector('input[data-name=dateLatestEra]').value.should.equal('Era 2');
    this.container.querySelector('input[data-name=dateLatestCertainty]').value.should.equal('Certainty 2');
    this.container.querySelector('input[data-name=dateLatestQualifier]').value.should.equal('Qual 2');
    this.container.querySelector('input[data-name=dateLatestQualifierValue]').value.should.equal(value.dateLatestQualifierValue);
    this.container.querySelector('input[data-name=dateLatestQualifierUnit]').value.should.equal('Unit 2');

    const newValue = {
      dateDisplayDate: '1998',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={newValue}
      />, this.container,
    );

    primaryInput = this.container.querySelector('input');
    primaryInput.value.should.equal('1998');

    Simulate.mouseDown(primaryInput);

    this.container.querySelector('input[data-name=datePeriod]').value.should.equal('');
  });

  it('should accept an Immutable map value, and distribute values to nested inputs', function test() {
    const value = Immutable.Map({
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    });

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
      />, this.container,
    );

    let primaryInput;

    primaryInput = this.container.querySelector('input');
    primaryInput.value.should.equal('June 2003-February 2012');

    Simulate.mouseDown(primaryInput);

    this.container.querySelector('input[data-name=datePeriod]').value.should.equal(value.get('datePeriod'));
    this.container.querySelector('input[data-name=dateAssociation]').value.should.equal(value.get('dateAssociation'));
    this.container.querySelector('input[data-name=dateNote]').value.should.equal(value.get('dateNote'));
    this.container.querySelector('input[data-name=dateEarliestSingleYear]').value.should.equal(value.get('dateEarliestSingleYear'));
    this.container.querySelector('input[data-name=dateEarliestSingleMonth]').value.should.equal(value.get('dateEarliestSingleMonth'));
    this.container.querySelector('input[data-name=dateEarliestSingleDay]').value.should.equal(value.get('dateEarliestSingleDay'));
    this.container.querySelector('input[data-name=dateEarliestSingleEra]').value.should.equal('Era 1');
    this.container.querySelector('input[data-name=dateEarliestSingleCertainty]').value.should.equal('Certainty 1');
    this.container.querySelector('input[data-name=dateEarliestSingleQualifier]').value.should.equal('Qual 1');
    this.container.querySelector('input[data-name=dateEarliestSingleQualifierValue]').value.should.equal(value.get('dateEarliestSingleQualifierValue'));
    this.container.querySelector('input[data-name=dateEarliestSingleQualifierUnit]').value.should.equal('Unit 1');
    this.container.querySelector('input[data-name=dateLatestYear]').value.should.equal(value.get('dateLatestYear'));
    this.container.querySelector('input[data-name=dateLatestMonth]').value.should.equal(value.get('dateLatestMonth'));
    this.container.querySelector('input[data-name=dateLatestDay]').value.should.equal(value.get('dateLatestDay'));
    this.container.querySelector('input[data-name=dateLatestEra]').value.should.equal('Era 2');
    this.container.querySelector('input[data-name=dateLatestCertainty]').value.should.equal('Certainty 2');
    this.container.querySelector('input[data-name=dateLatestQualifier]').value.should.equal('Qual 2');
    this.container.querySelector('input[data-name=dateLatestQualifierValue]').value.should.equal(value.get('dateLatestQualifierValue'));
    this.container.querySelector('input[data-name=dateLatestQualifierUnit]').value.should.equal('Unit 2');

    const newValue = Immutable.fromJS({
      dateDisplayDate: '1998',
    });

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={newValue}
      />, this.container,
    );

    primaryInput = this.container.querySelector('input');
    primaryInput.value.should.equal('1998');

    Simulate.mouseDown(primaryInput);

    this.container.querySelector('input[data-name=datePeriod]').value.should.equal('');
  });

  it('should use defaultValue as the value when value prop is not defined', function test() {
    const defaultValue = {
      dateDisplayDate: 'some default',
    };

    render(
      <StructuredDateInput
        defaultValue={defaultValue}
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value.should.equal('some default');
  });

  it('should set values to empty when value does not exist', function test() {
    render(
      <StructuredDateInput
        defaultValue={null}
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={null}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value.should.equal('');
  });

  it('should set the primary input value to dateDisplayDate', function test() {
    const value = {
      dateDisplayDate: 'June 2003-February 2012',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value.should.equal(value.dateDisplayDate);
  });

  it('should open when the primary input value changes', function test() {
    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value = 'June 2004';

    Simulate.change(primaryInput);

    primaryInput.value.should.equal('June 2004');

    this.container.querySelector('input[data-name=datePeriod]').should.not.equal(null);
  });

  it('should call onCommit when a dropdown input is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    const datePeriodInput = this.container.querySelector('input[data-name=datePeriod]');

    datePeriodInput.value = 'new period';

    Simulate.keyPress(datePeriodInput, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.datePeriod.should.equal('new period');

    datePeriodInput.value = 'another new period';

    Simulate.blur(datePeriodInput);

    committedPath.should.deep.equal(['birthDate']);
    committedValue.datePeriod.should.equal('another new period');
  });

  it('should call onCommit when the primary input is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value = 'new value';

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.dateDisplayDate.should.equal('new value');

    primaryInput.value = 'another new value';

    Simulate.blur(primaryInput);

    committedPath.should.deep.equal(['birthDate']);
    committedValue.dateDisplayDate.should.equal('another new value');
  });

  it('should not call onCommit when the primary input value is unchanged', function test() {
    let handlerCalled = false;

    const handleCommit = () => {
      handlerCalled = true;
    };

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    handlerCalled.should.equal(false);
  });

  it('should call parseDisplayDate when the display date changes and the value is immutable', function test() {
    let parsedDisplayDate = null;

    const parseDisplayDate = (displayDateArg) => {
      parsedDisplayDate = displayDateArg;

      return Promise.resolve({
        value: Immutable.Map({
          dateDisplayDate: displayDateArg,
          dateEarliestSingleYear: '2003',
          dateEarliestSingleMonth: '4',
          dateEarliestSingleDay: '12',
          dateEarliestSingleEra: '',
          dateEarliestSingleCertainty: '',
          dateEarliestSingleQualifier: '',
          dateEarliestSingleQualifierValue: '',
          dateEarliestSingleQualifierUnit: '',
          dateLatestYear: '',
          dateLatestMonth: '',
          dateLatestDay: '',
          dateLatestEra: '',
          dateLatestCertainty: '',
          dateLatestQualifier: '',
          dateLatestQualifierValue: '',
          dateLatestQualifierUnit: '',
        }),
      });
    };

    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    const value = Immutable.Map({
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    });

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        parseDisplayDate={parseDisplayDate}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value = 'new value';

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    parsedDisplayDate.should.equal('new value');

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedPath.should.deep.equal(['birthDate']);

        committedValue.should.equal(Immutable.Map({
          dateDisplayDate: 'new value',
          datePeriod: 'Period',
          dateAssociation: 'Assocation',
          dateNote: 'Note',
          dateEarliestSingleYear: '2003',
          dateEarliestSingleMonth: '4',
          dateEarliestSingleDay: '12',
          dateEarliestSingleEra: '',
          dateEarliestSingleCertainty: '',
          dateEarliestSingleQualifier: '',
          dateEarliestSingleQualifierValue: '',
          dateEarliestSingleQualifierUnit: '',
          dateLatestYear: '',
          dateLatestMonth: '',
          dateLatestDay: '',
          dateLatestEra: '',
          dateLatestCertainty: '',
          dateLatestQualifier: '',
          dateLatestQualifierValue: '',
          dateLatestQualifierUnit: '',
          dateEarliestScalarValue: '2003-04-12',
          dateLatestScalarValue: '2003-04-13',
          scalarValuesComputed: true,
        }));

        resolve();
      }, 0);
    });
  });

  it('should call parseDisplayDate when the display date changes', function test() {
    let parsedDisplayDate = null;

    const parseDisplayDate = (displayDateArg) => {
      parsedDisplayDate = displayDateArg;

      return Promise.resolve({
        value: {
          dateDisplayDate: displayDateArg,
          dateEarliestSingleYear: '2003',
          dateEarliestSingleMonth: '4',
          dateEarliestSingleDay: '12',
          dateEarliestSingleEra: '',
          dateEarliestSingleCertainty: '',
          dateEarliestSingleQualifier: '',
          dateEarliestSingleQualifierValue: '',
          dateEarliestSingleQualifierUnit: '',
          dateLatestYear: '',
          dateLatestMonth: '',
          dateLatestDay: '',
          dateLatestEra: '',
          dateLatestCertainty: '',
          dateLatestQualifier: '',
          dateLatestQualifierValue: '',
          dateLatestQualifierUnit: '',
        },
      });
    };

    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        parseDisplayDate={parseDisplayDate}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    primaryInput.value = 'new value';

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    parsedDisplayDate.should.equal('new value');

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedPath.should.deep.equal(['birthDate']);

        committedValue.should.deep.equal({
          dateDisplayDate: 'new value',
          datePeriod: 'Period',
          dateAssociation: 'Assocation',
          dateNote: 'Note',
          dateEarliestSingleYear: '2003',
          dateEarliestSingleMonth: '4',
          dateEarliestSingleDay: '12',
          dateEarliestSingleEra: '',
          dateEarliestSingleCertainty: '',
          dateEarliestSingleQualifier: '',
          dateEarliestSingleQualifierValue: '',
          dateEarliestSingleQualifierUnit: '',
          dateLatestYear: '',
          dateLatestMonth: '',
          dateLatestDay: '',
          dateLatestEra: '',
          dateLatestCertainty: '',
          dateLatestQualifier: '',
          dateLatestQualifierValue: '',
          dateLatestQualifierUnit: '',
          dateEarliestScalarValue: '2003-04-12',
          dateLatestScalarValue: '2003-04-13',
          scalarValuesComputed: true,
        });

        resolve();
      }, 0);
    });
  });

  it('should show a warning message when date parsing fails', function test() {
    const parseDisplayDate = () => Promise.resolve({
      isError: true,
    });

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        parseDisplayDate={parseDisplayDate}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    primaryInput.value = 'new value';

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        this.container.querySelector('.cspace-input-Message--warning').should.not.equal(null);

        resolve();
      }, 0);
    });
  });

  it('should recompute scalar dates when values are changed', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const value = {
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    };

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    const datePeriodInput = this.container.querySelector('input[data-name=dateLatestDay]');

    datePeriodInput.value = '13';

    Simulate.keyPress(datePeriodInput, { key: 'Enter' });

    committedValue.dateEarliestScalarValue.should.equal('2003-06-01');
    committedValue.dateLatestScalarValue.should.equal('2012-02-14');
    committedValue.scalarValuesComputed.should.equal(true);
  });

  it('should recompute scalar dates when values are changed in an immutable map', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const value = Immutable.fromJS({
      dateDisplayDate: 'June 2003-February 2012',
      datePeriod: 'Period',
      dateAssociation: 'Assocation',
      dateNote: 'Note',
      dateEarliestSingleYear: '2003',
      dateEarliestSingleMonth: '6',
      dateEarliestSingleDay: '1',
      dateEarliestSingleEra: 'era1',
      dateEarliestSingleCertainty: 'certainty1',
      dateEarliestSingleQualifier: 'qual1',
      dateEarliestSingleQualifierValue: '23',
      dateEarliestSingleQualifierUnit: 'unit1',
      dateLatestYear: '2012',
      dateLatestMonth: '2',
      dateLatestDay: '28',
      dateLatestEra: 'era2',
      dateLatestCertainty: 'certainty2',
      dateLatestQualifier: 'qual2',
      dateLatestQualifierValue: '45',
      dateLatestQualifierUnit: 'unit2',
    });

    render(
      <StructuredDateInput
        name="birthDate"
        optionLists={optionLists}
        terms={terms}
        value={value}
        onCommit={handleCommit}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    const datePeriodInput = this.container.querySelector('input[data-name=dateLatestDay]');

    datePeriodInput.value = '13';

    Simulate.keyPress(datePeriodInput, { key: 'Enter' });

    committedValue.get('dateEarliestScalarValue').should.equal('2003-06-01');
    committedValue.get('dateLatestScalarValue').should.equal('2012-02-14');
    committedValue.get('scalarValuesComputed').should.equal(true);
  });

  it('should call formatFieldLabel to format the field labels', function test() {
    const formatFieldLabel = (name) => `formatted ${name}`;

    render(<StructuredDateInput formatFieldLabel={formatFieldLabel} />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    this.container.querySelector('label').textContent.should.equal('formatted datePeriod');
  });

  it('should call formatOptionLabel to format the option labels', function test() {
    const formatOptionLabel = (option) => `formatted ${option.value}`;

    render(
      <StructuredDateInput
        formatOptionLabel={formatOptionLabel}
        optionLists={optionLists}
      />, this.container,
    );

    const primaryInput = this.container.querySelector('input');

    Simulate.mouseDown(primaryInput);

    const qualifierInput = this.container.querySelector('input[data-name=dateEarliestSingleQualifier]');

    Simulate.mouseDown(qualifierInput);

    this.container.querySelector('li').textContent.should.equal('formatted qual1');
  });
});
