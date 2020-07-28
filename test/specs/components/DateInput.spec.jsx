/* global window */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import DateInput from '../../../src/components/DateInput';
import commitHandler from '../../helpers/commitHandler';
import createTestContainer from '../../helpers/createTestContainer';
import { isInput } from '../../../src/helpers/inputHelpers';

const { expect } = chai;

chai.should();

describe('DateInput', function suite() {
  // iOS tests on SauceLabs are slow.
  this.timeout(10000);

  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<DateInput />).should.equal(true);
  });

  it('should be closed initially', function test() {
    const EnhancedDateInput = commitHandler(DateInput);
    render(<EnhancedDateInput />, this.container);

    expect(this.container.querySelector('.react-calendar')).to.equal(null);
  });

  it('should not open on focus', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);

    expect(this.container.querySelector('.react-calendar')).to.equal(null);
  });

  it('should open on mouse down', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('.react-calendar').should.not.equal(null);
  });

  it('should open when the input value changes', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.change(input);

    this.container.querySelector('.react-calendar').should.not.equal(null);
  });

  it('should close the calendar dropdown when tab is pressed in the input', function test() {
    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
      />, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.focus(input);

    input.value = '1999-04-22';

    Simulate.change(input);

    this.container.querySelector('.react-calendar').should.not.equal(null);

    Simulate.keyDown(input, { key: 'Tab' });

    expect(this.container.querySelector('.react-calendar')).to.equal(null);
  });

  it('should call onCommit when enter is depressed in the dropdown input', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    input.value = '1999-04-22';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.should.equal('1999-04-22');
  });

  it('should not call onCommit when the dropdown input value is unchanged from the initial value', function test() {
    let handlerCalled = false;

    const handleCommit = () => {
      handlerCalled = true;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    input.value = '2011-11-02';

    Simulate.change(input);
    Simulate.keyPress(input, { key: 'Enter' });

    handlerCalled.should.equal(false);
  });

  it('should call onCommit when a value is selected in the calendar', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const dateButton = this.container.querySelector('button.react-calendar__month-view__days__day');

    Simulate.click(dateButton);

    committedPath.should.deep.equal(['birthDate']);
    committedValue.should.not.equal(null);
  });

  it('should not call onCommit when the selected calendar date is unchanged from the initial value', function test() {
    let handlerCalled = false;

    const handleCommit = () => {
      handlerCalled = true;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const calendar = this.container.querySelector('.react-calendar');

    Simulate.keyDown(calendar, { key: 'Escape' });

    handlerCalled.should.equal(false);
  });

  it('should commit a blank value when the calendar closes, even if enter was not pressed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    input.value = '';

    Simulate.change(input);
    Simulate.blur(input);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedPath.should.deep.equal(['birthDate']);
        committedValue.should.equal('');

        resolve();
      }, 0);
    });
  });

  it('should not commit a blank value if the calendar closes due to escape being depressed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(
      <DateInput
        name="birthDate"
        value="2011-11-02T00:00:00.000Z"
        onCommit={handleCommit}
      />, this.container,
    );

    const input = this.container.querySelector('input');

    input.value = '';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(committedPath).to.equal(null);
        expect(committedValue).to.equal(null);

        resolve();
      }, 0);
    });
  });

  it('should label weekdays based on locale', function test() {
    render(<DateInput locale="fr" />, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('.react-calendar__month-view__weekdays__weekday').textContent
      .should.equal('lun');
  });

  it('should normalize the value', function test() {
    render(
      <DateInput
        value="2011-11-02T00:00:00.000Z"
      />, this.container,
    );

    const input = this.container.querySelector('input');

    input.value.should.equal('2011-11-02');

    render(
      <DateInput
        value="1974-04-25T00:00:00.000Z"
      />, this.container,
    );

    input.value.should.equal('1974-04-25');
  });

  it('should render a disabled LineInput if readOnly is true', function test() {
    render(<DateInput value="2017-03-11T00:00:00.000Z" readOnly />, this.container);

    const input = this.container.firstElementChild;

    input.className.should.contain('cspace-input-LineInput--normal');
    input.disabled.should.equal(true);
    input.value.should.equal('2017-03-11');
  });

  it('should display year-last dates', function test() {
    render(<DateInput value="01/01/1995" />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('01/01/1995');
  });

  it('should display year only dates', function test() {
    render(<DateInput value="2005" />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('2005');
  });

  it('should display year/month only dates', function test() {
    render(<DateInput value="04-1995" />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('04-1995');
  });

  it('should display invalid dates and persist if the field is clicked', function test() {
    render(<DateInput value="01/01/1995" />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('01/01/1995');
    Simulate.mouseDown(input);
    this.container.querySelector('.react-calendar').should.not.equal(null);

    Simulate.keyDown(input, { key: 'Escape' });
    input.value.should.equal('01/01/1995');
  });
});
