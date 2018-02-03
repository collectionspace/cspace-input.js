/* global document */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import { isInput } from '../../../src/helpers/inputHelpers';
import LineInput from '../../../src/components/LineInput';

const expect = chai.expect;

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

  it('should render as a div when asText is true', function test() {
    render(<LineInput value="Test" asText />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
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

  it('should normalize a null value to empty string', function test() {
    render(<LineInput value={null} />, this.container);

    this.container.firstElementChild.value.should.equal('');
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

  it('should render a disabled iput if readOnly is true', function test() {
    render(<LineInput value={'Hello world'} readOnly />, this.container);

    const input = this.container.firstElementChild;

    input.nodeName.should.equal('INPUT');
    input.disabled.should.equal(true);
    input.value.should.equal('Hello world');
  });

  it('should call the api callback when mounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<LineInput api={api} />, this.container);

    inputApi.should.have.property('focus').that.is.a('function');
  });

  it('should call the api callback when unmounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<LineInput api={api} />, this.container);

    inputApi.should.not.equal(null);

    unmountComponentAtNode(this.container);

    expect(inputApi).to.equal(null);
  });

  it('should render a link alongside the input if showLink is true', function test() {
    const value = 'http://collectionspace.org/';

    render(<LineInput value={value} showLink />, this.container);

    this.container.querySelector('a').should.have.property('href', value);
  });

  it('should not render a link alongside the input if showLink is true but the value is not a URL', function test() {
    const value = 'foo';

    render(<LineInput value={value} showLink />, this.container);

    expect(this.container.querySelector('a')).to.equal(null);
  });

  it('should become focused when the focus api is called', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<LineInput api={api} />, this.container);

    inputApi.focus();

    const input = this.container.querySelector('input');

    document.activeElement.should.equal(input);
  });
});
