import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import Popup from '../../../src/components/Popup';

chai.should();

const expectedClassName = 'cspace-input-Popup--common';

describe('Popup', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(<Popup />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render with correct class', function test() {
    render(<Popup />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render contents', function test() {
    render(
      <div style={{ position: 'relative' }}>
        <Popup>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    this.container.querySelector('span').textContent.should.equal('Hello');
  });

  it('should call onBlur when focus is lost', function test() {
    let handlerCalled = false;

    const handleBlur = () => {
      handlerCalled = true;
    };

    render(
      <div style={{ position: 'relative' }}>
        <Popup onBlur={handleBlur}>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    Simulate.blur(element);

    handlerCalled.should.equal(true);
  });

  it('should not require onBlur prop', function test() {
    render(
      <div style={{ position: 'relative' }}>
        <Popup>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    Simulate.blur(element);
  });

  it('should call onKeyDown when a key is depressed', function test() {
    let handlerCalled = false;

    const handleKeyDown = () => {
      handlerCalled = true;
    };

    render(
      <div style={{ position: 'relative' }}>
        <Popup onKeyDown={handleKeyDown}>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    Simulate.keyDown(element);

    handlerCalled.should.equal(true);
  });

  it('should not require onKeyDown prop', function test() {
    render(
      <div style={{ position: 'relative' }}>
        <Popup>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    Simulate.keyDown(element);
  });

  it('should call onMounted after mount', function test() {
    let handlerCalled = false;

    const handleMounted = () => {
      handlerCalled = true;
    };

    render(
      <div style={{ position: 'relative' }}>
        <Popup onMounted={handleMounted}>
          <span>Hello</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    handlerCalled.should.equal(true);
  });

  it('should render with minimum width of 100%', function test() {
    const width = 200;

    render(
      <div style={{ position: 'relative', width: `${width}px` }}>
        <Popup>
          <span>Hi</span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    element.getBoundingClientRect().width.should.be.closeTo(width, 0.5);
  });

  it('should expand when content exceeds the width of the container', function test() {
    const width = 200;

    render(
      <div style={{ position: 'relative', width: `${width}px` }}>
        <Popup>
          <span style={{ whiteSpace: 'nowrap' }}>
            This is some really long content that exceeds the length of the container, so the popup
            should expand to fit.
          </span>
        </Popup>
        <br /><br />
      </div>, this.container);

    const element = this.container.querySelector(`div.${expectedClassName}`);

    element.getBoundingClientRect().width.should.be.above(width, 0.5);
  });
});
