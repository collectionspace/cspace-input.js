import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import PasswordInput from '../../../src/components/PasswordInput';

chai.should();

const expectedClassName = 'cspace-input-LineInput--normal cspace-input-TextInput--normal cspace-input-TextInput--common cspace-input-Input--common';

describe('PasswordInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
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
});
