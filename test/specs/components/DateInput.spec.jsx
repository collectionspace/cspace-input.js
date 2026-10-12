/* global window */

import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import DateInput from '../../../src/components/DateInput';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import { isInput } from '../../../src/helpers/inputHelpers';

const { expect } = chai;

chai.should();

describe.only('DateInput', function suite() {
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

    Simulate.change(input, { target: { value: '2022-10-02' } });

    committedPath.should.deep.equal(['birthDate']);
    committedValue.should.not.equal(null);
  });

  it('should not call onCommit when the input value is unchanged from the initial value', function test() {
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

    Simulate.change(input, { target: { value: '2011-11-02' } });

    handlerCalled.should.equal(false);
  });

  it('should commit a blank value', function test() {
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
    Simulate.change(input, { target: { value: '' } });

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

  it('should render a LineInput if asText is true', function test() {
    render(<DateInput value="2017-03-11T00:00:00.000Z" asText />, this.container);

    const div = this.container.firstElementChild;

    div.className.should.contain('cspace-input-LineInput--normal');
    div.textContent.should.equal('2017-03-11');
  });
});
