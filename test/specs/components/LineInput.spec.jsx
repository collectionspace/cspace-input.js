import React from 'react';
import { render } from 'react-dom';

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
});
