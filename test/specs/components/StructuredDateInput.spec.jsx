import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import Immutable from 'immutable';
import BaseStructuredDateInput from '../../../src/components/StructuredDateInput';
import createTestContainer from '../../helpers/createTestContainer';
import isInput from '../../../src/helpers/isInput';
import labelable from '../../../src/enhancers/labelable';
import repeatable from '../../../src/enhancers/repeatable';

const StructuredDateInput = repeatable(labelable(BaseStructuredDateInput));

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

  it('should be considered an input by isInput()', function test() {
    isInput(<StructuredDateInput />).should.equal(true);
  });

  it('should open the dropdown when the primary input receives focus', function test() {
    render(<StructuredDateInput />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    this.container.querySelector('table').should.not.equal(null);
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
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    this.container.querySelector('input[name=datePeriod]').value.should.equal(value.datePeriod);
    this.container.querySelector('input[name=dateAssociation]').value.should.equal(value.dateAssociation);
    this.container.querySelector('input[name=dateNote]').value.should.equal(value.dateNote);
    this.container.querySelector('input[name=dateEarliestSingleYear]').value.should.equal(value.dateEarliestSingleYear);
    this.container.querySelector('input[name=dateEarliestSingleMonth]').value.should.equal(value.dateEarliestSingleMonth);
    this.container.querySelector('input[name=dateEarliestSingleDay]').value.should.equal(value.dateEarliestSingleDay);
    this.container.querySelector('input[name=dateEarliestSingleEra]').value.should.equal('Era 1');
    this.container.querySelector('input[name=dateEarliestSingleCertainty]').value.should.equal('Certainty 1');
    this.container.querySelector('input[name=dateEarliestSingleQualifier]').value.should.equal('Qual 1');
    this.container.querySelector('input[name=dateEarliestSingleQualifierValue]').value.should.equal(value.dateEarliestSingleQualifierValue);
    this.container.querySelector('input[name=dateEarliestSingleQualifierUnit]').value.should.equal('Unit 1');
    this.container.querySelector('input[name=dateLatestYear]').value.should.equal(value.dateLatestYear);
    this.container.querySelector('input[name=dateLatestMonth]').value.should.equal(value.dateLatestMonth);
    this.container.querySelector('input[name=dateLatestDay]').value.should.equal(value.dateLatestDay);
    this.container.querySelector('input[name=dateLatestEra]').value.should.equal('Era 2');
    this.container.querySelector('input[name=dateLatestCertainty]').value.should.equal('Certainty 2');
    this.container.querySelector('input[name=dateLatestQualifier]').value.should.equal('Qual 2');
    this.container.querySelector('input[name=dateLatestQualifierValue]').value.should.equal(value.dateLatestQualifierValue);
    this.container.querySelector('input[name=dateLatestQualifierUnit]').value.should.equal('Unit 2');
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
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    this.container.querySelector('input[name=datePeriod]').value.should.equal(value.get('datePeriod'));
    this.container.querySelector('input[name=dateAssociation]').value.should.equal(value.get('dateAssociation'));
    this.container.querySelector('input[name=dateNote]').value.should.equal(value.get('dateNote'));
    this.container.querySelector('input[name=dateEarliestSingleYear]').value.should.equal(value.get('dateEarliestSingleYear'));
    this.container.querySelector('input[name=dateEarliestSingleMonth]').value.should.equal(value.get('dateEarliestSingleMonth'));
    this.container.querySelector('input[name=dateEarliestSingleDay]').value.should.equal(value.get('dateEarliestSingleDay'));
    this.container.querySelector('input[name=dateEarliestSingleEra]').value.should.equal('Era 1');
    this.container.querySelector('input[name=dateEarliestSingleCertainty]').value.should.equal('Certainty 1');
    this.container.querySelector('input[name=dateEarliestSingleQualifier]').value.should.equal('Qual 1');
    this.container.querySelector('input[name=dateEarliestSingleQualifierValue]').value.should.equal(value.get('dateEarliestSingleQualifierValue'));
    this.container.querySelector('input[name=dateEarliestSingleQualifierUnit]').value.should.equal('Unit 1');
    this.container.querySelector('input[name=dateLatestYear]').value.should.equal(value.get('dateLatestYear'));
    this.container.querySelector('input[name=dateLatestMonth]').value.should.equal(value.get('dateLatestMonth'));
    this.container.querySelector('input[name=dateLatestDay]').value.should.equal(value.get('dateLatestDay'));
    this.container.querySelector('input[name=dateLatestEra]').value.should.equal('Era 2');
    this.container.querySelector('input[name=dateLatestCertainty]').value.should.equal('Certainty 2');
    this.container.querySelector('input[name=dateLatestQualifier]').value.should.equal('Qual 2');
    this.container.querySelector('input[name=dateLatestQualifierValue]').value.should.equal(value.get('dateLatestQualifierValue'));
    this.container.querySelector('input[name=dateLatestQualifierUnit]').value.should.equal('Unit 2');
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
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    primaryInput.value.should.equal(value.dateDisplayDate);
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
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    const datePeriodInput = this.container.querySelector('input[name=datePeriod]');

    datePeriodInput.value = 'new period';

    Simulate.keyPress(datePeriodInput, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate', 'datePeriod']);
    committedValue.should.equal('new period');

    datePeriodInput.value = 'another new period';

    Simulate.blur(datePeriodInput);

    committedPath.should.deep.equal(['birthDate', 'datePeriod']);
    committedValue.should.equal('another new period');
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
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    primaryInput.value = 'new value';

    Simulate.keyPress(primaryInput, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate', 'dateDisplayDate']);
    committedValue.should.equal('new value');

    primaryInput.value = 'another new value';

    Simulate.blur(primaryInput);

    committedPath.should.deep.equal(['birthDate', 'dateDisplayDate']);
    committedValue.should.equal('another new value');
  });

  it('should call formatFieldLabel to format the field labels', function test() {
    const formatFieldLabel = name => `formatted ${name}`;

    render(<StructuredDateInput formatFieldLabel={formatFieldLabel} />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    this.container.querySelector('label').textContent.should.equal('formatted datePeriod');
  });

  it('should call formatOptionLabel to format the option labels', function test() {
    const formatOptionLabel = option => `formatted ${option.value}`;

    render(
      <StructuredDateInput
        formatOptionLabel={formatOptionLabel}
        optionLists={optionLists}
      />, this.container);

    const primaryInput = this.container.querySelector('input');

    Simulate.focus(primaryInput);

    const qualifierInput = this.container.querySelector('input[name=dateEarliestSingleQualifier]');

    Simulate.mouseDown(qualifierInput);

    this.container.querySelector('li').textContent.should.equal('formatted qual1');
  });
});
