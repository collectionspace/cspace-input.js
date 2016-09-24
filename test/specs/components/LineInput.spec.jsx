import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import isInput from '../../../src/helpers/isInput';
import LineInput from '../../../src/components/LineInput';

chai.should();

const expectedClassName = 'cspace-input-LineInput--normal cspace-input-TextInput--normal cspace-input-TextInput--common cspace-input-Input--common';

describe('LineInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<LineInput />).should.equal(true);
  });

  it('should render as an input with type \'text\'', function test() {
    render(<LineInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('INPUT');
    this.container.firstElementChild.type.should.equal('text');
  });

  it('should render with correct class', function test() {
    render(<LineInput value="Test" />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render the value prop as the value of the input', function test() {
    const value = 'Test';

    render(<LineInput value={value} />, this.container);

    this.container.firstElementChild.value.should.equal(value);
  });

  it('should not show more than one line of input', function test() {
    const lines = ['Line 1', 'Line 2'];
    const value = lines.join('\n');

    render(<LineInput value={value} />, this.container);

    const measuringStick = createInvisible('input');
    measuringStick.className = expectedClassName;
    measuringStick.value = lines[0];

    this.container.firstElementChild.getBoundingClientRect().height.should
      .equal(measuringStick.getBoundingClientRect().height);
  });

  it('should call onCommit when enter is pressed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(<LineInput name="input" onCommit={handleCommit} />, this.container);

    const input = this.container.firstElementChild;
    const newValue = input.value = 'New value';

    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['input']);
    committedValue.should.equal(newValue);
  });

  it('should not call onCommit when other keys are pressed', function test() {
    let handlerCalled = false;

    const handleCommit = () => {
      handlerCalled = true;
    };

    render(<LineInput onCommit={handleCommit} />, this.container);

    const input = this.container.firstElementChild;

    Simulate.keyPress(input, { key: 'a' });

    handlerCalled.should.equal(false);
  });

  it('should call onCommit when focus is lost', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    render(<LineInput name="input" onCommit={handleCommit} />, this.container);

    const input = this.container.firstElementChild;
    const newValue = 'New value';

    input.value = newValue;

    Simulate.blur(input);

    committedPath.should.deep.equal(['input']);
    committedValue.should.equal(newValue);
  });
});
