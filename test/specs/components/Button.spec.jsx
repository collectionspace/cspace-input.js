import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import Button from '../../../src/components/Button';

chai.should();

describe('Button', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a button', function test() {
    render(<Button>Test</Button>, this.container);

    this.container.firstElementChild.nodeName.should.equal('BUTTON');
  });

  it('should render with correct class', function test() {
    render(<Button>Button</Button>, this.container);

    this.container.firstElementChild.className.should.equal(
      'cspace-input-Button--common ' +
      'cspace-input-Input--common');
  });
});
