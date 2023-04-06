/* global document */

import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import { isInput } from '../../../src/helpers/inputHelpers';
import PasswordInput from '../../../src/components/PasswordInput';

const { expect } = chai;

chai.should();

const expectedClassName = 'cspace-input-LineInput--normal cspace-input-TextInput--normal cspace-input-TextInput--common cspace-input-Input--common';

describe('PasswordInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<PasswordInput />).should.equal(true);
  });

  it('should render as an input with type \'password\'', function test() {
    render(<PasswordInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('INPUT');
    this.container.firstElementChild.type.should.equal('password');
  });

  it('should render correct class', function test() {
    render(<PasswordInput value="Test" />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render the value prop as the value of the input', function test() {
    const value = 'Test';

    render(<PasswordInput value={value} />, this.container);

    this.container.firstElementChild.value.should.equal(value);
  });

  it('should call the api callback when mounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<PasswordInput api={api} />, this.container);

    inputApi.should.have.property('focus').that.is.a('function');
  });

  it('should call the api callback when unmounted', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<PasswordInput api={api} />, this.container);

    inputApi.should.not.equal(null);

    unmountComponentAtNode(this.container);

    expect(inputApi).to.equal(null);
  });

  it('should become focused when the focus api is called', function test() {
    let inputApi = null;

    const api = (apiArg) => {
      inputApi = apiArg;
    };

    render(<PasswordInput api={api} />, this.container);

    inputApi.focus();

    const input = this.container.querySelector('input');

    document.activeElement.should.equal(input);
  });
});
