/* global window */

import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import DateInput from '../../../src/components/DateInput';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
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
});
