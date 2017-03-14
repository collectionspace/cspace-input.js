import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';
import createInvisible from '../../helpers/createInvisible';

import { isInput } from '../../../src/helpers/inputHelpers';
import ReadOnlyInput from '../../../src/components/ReadOnlyInput';

chai.should();

const expectedClassName = 'cspace-input-ReadOnlyInput--common cspace-input-Input--common';

describe('ReadOnlyInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
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

  it('should render newlines visibly', function test() {
    const lines = ['This should be above', 'This should be below'];
    const value = lines.join('\n');

    render(<ReadOnlyInput value={value} />, this.container);

    const measuringStick = createInvisible('div');
    measuringStick.className = expectedClassName;
    measuringStick.style.minHeight = '0';
    measuringStick.textContent = lines[0];

    this.container.firstElementChild.textContent.should.equal(value);

    // IE measurements are sometimes slightly off. Fudge by .01 pixels.

    this.container.firstElementChild.getBoundingClientRect().height.should
      .be.at.least((measuringStick.getBoundingClientRect().height * 2) - 0.01);
  });

  it('should not interpret HTML tags as rendering instructions', function test() {
    const parts = [' This ', ' should be ', ' one line '];
    const value = `<div>${parts[0]}<br>${parts[1]}<hr>${parts[2]}</div>`;

    render(<ReadOnlyInput value={value} />, this.container);

    const measuringStick = createInvisible('div');
    measuringStick.className = expectedClassName;
    measuringStick.textContent = parts[0];

    this.container.firstElementChild.textContent.should.equal(value);

    // IE measurements are sometimes slightly off. Fudge by .01 pixels.

    this.container.firstElementChild.getBoundingClientRect().height.should
      .be.closeTo(measuringStick.getBoundingClientRect().height, 0.01);
  });
});
