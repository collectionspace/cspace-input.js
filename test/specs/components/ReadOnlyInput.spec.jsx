import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import { isInput } from '../../../src/helpers/inputHelpers';
import ReadOnlyInput from '../../../src/components/ReadOnlyInput';

chai.should();

const expectedClassName = 'cspace-input-ReadOnlyInput--normal cspace-input-ReadOnlyInput--common cspace-input-Input--common';

describe('ReadOnlyInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<ReadOnlyInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<ReadOnlyInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render with correct class', function test() {
    render(<ReadOnlyInput value="Test" />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should not interpret HTML tags as rendering instructions', function test() {
    const parts = [' This ', ' should be ', ' one line '];
    const value = `<div>${parts[0]}<br>${parts[1]}<hr>${parts[2]}</div>`;

    render(<ReadOnlyInput value={value} />, this.container);

    const measuringStick = createInvisible('div');

    measuringStick.className = expectedClassName;

    [measuringStick.textContent] = parts;

    this.container.firstElementChild.textContent.should.equal(value);

    // IE measurements are sometimes slightly off. Fudge by .01 pixels.

    this.container.firstElementChild.getBoundingClientRect().height.should
      .be.closeTo(measuringStick.getBoundingClientRect().height, 0.01);
  });
});
