/* global document */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import { isInput } from '../../../src/helpers/inputHelpers';
import MultilineInput from '../../../src/components/MultilineInput';

const { expect } = chai;

chai.should();

const expectedClassName = 'cspace-input-MultilineInput--normal cspace-input-MultilineInput--common cspace-input-TextInput--normal cspace-input-TextInput--common cspace-input-Input--common';

describe('MultilineInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<MultilineInput />).should.equal(true);
  });

  it('should render as a textarea', function test() {
    render(<MultilineInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('TEXTAREA');
  });

  it('should render as a div when asText is true', function test() {
    render(<MultilineInput value="Test" asText />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render with correct class', function test() {
    render(<MultilineInput value="Test" />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render the value prop as the value of the input', function test() {
    const value = 'Test';

    render(<MultilineInput value={value} />, this.container);

    this.container.firstElementChild.value.should.equal(value);
  });

  it('should normalize a null value to empty string', function test() {
    render(<MultilineInput value={null} />, this.container);

    this.container.firstElementChild.value.should.equal('');
  });

  it('should show more than one line of input', function test() {
    const lines = ['Line 1', 'Line 2'];
    const value = lines.join('\n');

    render(<MultilineInput value={value} />, this.container);

    const measuringStick = createInvisible('input');

    measuringStick.className = 'cspace-input-line cspace-input-base';

    [measuringStick.value] = lines;

    this.container.firstElementChild.getBoundingClientRect().height.should
      .be.above(measuringStick.getBoundingClientRect().height);
  });

  it('should render a disabled textarea if readOnly is true', function test() {
    render(<MultilineInput value={'Hello world\nLine 2'} readOnly />, this.container);

    const input = this.container.firstElementChild;

    input.nodeName.should.equal('TEXTAREA');
    input.disabled.should.equal(true);
    input.textContent.should.equal('Hello world\nLine 2');
  });

  it('should call the api callback when mounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<MultilineInput api={api} />, this.container);

    inputApi.should.have.property('focus').that.is.a('function');
  });

  it('should call the api callback when unmounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<MultilineInput api={api} />, this.container);

    inputApi.should.not.equal(null);

    unmountComponentAtNode(this.container);

    expect(inputApi).to.equal(null);
  });

  it('should become focused when the focus api is called', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<MultilineInput api={api} />, this.container);

    inputApi.focus();

    const input = this.container.querySelector('textarea');

    document.activeElement.should.equal(input);
  });
});
