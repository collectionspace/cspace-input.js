import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import DateInput from '../../../src/components/DateInput';
import createTestContainer from '../../helpers/createTestContainer';
import isInput from '../../../src/helpers/isInput';

const expect = chai.expect;

chai.should();

describe('DateInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<DateInput />).should.equal(true);
  });

  it('should be closed initially', function test() {
    render(<DateInput />, this.container);

    expect(this.container.querySelector('.react-date-picker__month-view')).to.equal(null);
  });

  it('should not open on focus', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);

    expect(this.container.querySelector('.react-date-picker__month-view')).to.equal(null);
  });

  it('should open on mouse down', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('.react-date-picker__month-view').should.not.equal(null);
  });

  it('should open when the input value changes', function test() {
    render(<DateInput />, this.container);

    const input = this.container.querySelector('input');

    Simulate.change(input);

    this.container.querySelector('.react-date-picker__month-view').should.not.equal(null);
  });

  it('should call onCommit when a value is committed in the dropdown input', function test() {
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
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = '1999-04-22';

    Simulate.change(input);
    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.should.equal('1999-04-22');
  });

  it('should commit a blank value entered in the dropdown input', function test() {
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
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = '';

    Simulate.change(input);
    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.should.equal('');
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
      />, this.container);

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
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const calendar = this.container.querySelector('.react-date-picker__month-view');

    Simulate.keyDown(calendar, { key: 'ArrowDown' });
    Simulate.keyDown(calendar, { key: 'Enter' });

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
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const calendar = this.container.querySelector('.react-date-picker__month-view');

    Simulate.keyDown(calendar, { key: 'Enter' });

    handlerCalled.should.equal(false);
  });

  it('should label weekdays based on locale', function test() {
    render(<DateInput locale="fr" />, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('.react-date-picker__month-view-week-day-name').textContent
      .should.equal('lun.');
  });

  it('should normalize the value', function test() {
    render(
      <DateInput
        value="2011-11-02T00:00:00.000Z"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('2011-11-02');

    render(
      <DateInput
        value="1974-04-25T00:00:00.000Z"
      />, this.container);

    input.value.should.equal('1974-04-25');
  });

  it('should label footer buttons using props', function test() {
    render(
      <DateInput
        todayButtonLabel="today label"
        clearButtonLabel="clear label"
        okButtonLabel="ok label"
        cancelButtonLabel="cancel label"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const labels = [];
    let buttons;

    buttons = this.container.querySelectorAll('.react-date-picker__footer-button');

    for (let i = 0; i < buttons.length; i += 1) {
      labels.push(buttons[i].textContent);
    }

    const navBarDate = this.container.querySelector('.react-date-picker__nav-bar-date');

    Simulate.mouseDown(navBarDate);

    buttons = this.container.querySelectorAll('.react-date-picker__history-view .react-date-picker__footer-button');

    for (let i = 0; i < buttons.length; i += 1) {
      labels.push(buttons[i].textContent);
    }

    labels.should.deep.equal(['today label', 'clear label', 'ok label', 'cancel label']);
  });
});
