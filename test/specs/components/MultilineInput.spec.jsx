import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import { isInput } from '../../../src/helpers/inputHelpers';
import MultilineInput from '../../../src/components/MultilineInput';

chai.should();

const expectedClassName = 'cspace-input-MultilineInput--normal cspace-input-MultilineInput--common cspace-input-TextInput--normal cspace-input-TextInput--common cspace-input-Input--common';

describe('MultilineInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<MultilineInput />).should.equal(true);
  });

  it('should render as an input with type \'textarea\'', function test() {
    render(<MultilineInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('TEXTAREA');
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
    measuringStick.value = lines[0];

    this.container.firstElementChild.getBoundingClientRect().height.should
      .be.above(measuringStick.getBoundingClientRect().height);
  });
});
