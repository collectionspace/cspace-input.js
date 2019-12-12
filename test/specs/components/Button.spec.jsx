import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import Button from '../../../src/components/Button';

chai.should();

const expectedClassName = 'cspace-input-Button--common cspace-input-Input--common';

describe('Button', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a button', function test() {
    render(<Button>Test</Button>, this.container);

    this.container.firstElementChild.nodeName.should.equal('BUTTON');
  });

  it('should render with correct class', function test() {
    render(<Button>Button</Button>, this.container);

    this.container.firstElementChild.className.should
      .equal(expectedClassName);
  });

  it('should render with icon class when icon prop is true', function test() {
    render(<Button icon>Button</Button>, this.container);

    this.container.firstElementChild.className.should
      .equal(`cspace-input-Button--icon ${expectedClassName}`);
  });

  it('should render with custom class passed as a prop', function test() {
    render(<Button className="myclass">Button</Button>, this.container);

    this.container.firstElementChild.className.should
      .equal(`${expectedClassName} myclass`);
  });
});
