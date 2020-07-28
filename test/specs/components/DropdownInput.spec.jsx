/* global window, document */

import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import { isInput } from '../../../src/helpers/inputHelpers';
import DropdownInput from '../../../src/components/DropdownInput';

const { expect } = chai;

chai.should();

const expectedClassName = 'cspace-input-DropdownInput--normal cspace-input-DropdownInput--common';

describe('DropdownInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<DropdownInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<DropdownInput value="Test" />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render with correct class', function test() {
    render(<DropdownInput value="Test" />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should call onMount when mounted, and supply a focusInput function', function test() {
    let onMountArgs = null;

    const handleMount = (args) => {
      onMountArgs = args;
    };

    render(<DropdownInput onMount={handleMount} />, this.container);

    onMountArgs.should.be.an('object')
      .with.property('focusInput').that.is.a('function');
  });

  it('should open and close depending on the open prop', function test() {
    render(
      <DropdownInput open>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    this.container.querySelector('p').textContent.should.equal('content');

    render(
      <DropdownInput open={false}>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('p')).to.equal(null);

        render(
          <DropdownInput open>
            <p>content</p>
          </DropdownInput>, this.container,
        );

        this.container.querySelector('p').textContent.should.equal('content');

        resolve();
      }, 0);
    });
  });

  it('should open on mouse down', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should not open if readOnly is true', function test() {
    render(
      <DropdownInput readOnly>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    expect(this.container.querySelector('p')).to.equal(null);
  });

  it('should open if readOnly is true and isOpenableWhenReadOnly is true', function test() {
    render(
      <DropdownInput readOnly isOpenableWhenReadOnly>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should open on focus if openOnFocus is true', function test() {
    render(
      <DropdownInput openOnFocus>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.focus(input);

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should not open on focus if openOnFocus is false', function test() {
    render(
      <DropdownInput openOnFocus={false}>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.focus(input);

    expect(this.container.querySelector('p')).to.equal(null);
  });

  it('should open when down arrow is depressed in the input', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should call focusPopup when down arrow is depressed in the input', function test() {
    let focusPopupCalled = false;

    const focusPopup = () => {
      focusPopupCalled = true;
    };

    render(
      <DropdownInput focusPopup={focusPopup}>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    focusPopupCalled.should.equal(true);
  });

  it('should call focusPopup when down arrow is depressed in the input with the popup already open', function test() {
    let focusPopupCalled = false;

    const focusPopup = () => {
      focusPopupCalled = true;
    };

    render(
      <DropdownInput focusPopup={focusPopup}>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('p').textContent.should.equal('content');
    focusPopupCalled.should.equal(false);

    Simulate.keyDown(input, { key: 'ArrowDown' });

    focusPopupCalled.should.equal(true);
  });

  it('should close when escape is depressed', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('p').textContent.should.equal('content');

    Simulate.keyDown(input, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('p')).to.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should close when focus is lost', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('p').textContent.should.equal('content');

    Simulate.blur(input);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('p')).to.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should call onBlur when the input loses focus', function test() {
    let handlerCalled = false;

    const handleBlur = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onBlur={handleBlur}>
        <p>content</p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.blur(input);

    handlerCalled.should.equal(true);
  });

  it('should not close when focus moves from the input to the popup', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.blur(input, { relatedTarget: textarea });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        this.container.querySelector('p').should.not.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should call onBlur when focus moves from the input to the popup', function test() {
    let handlerCalled = false;

    const handleBlur = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onBlur={handleBlur}>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.blur(input, { relatedTarget: textarea });

    handlerCalled.should.equal(true);
  });

  it('should close when escape is depressed in the popup', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.keyDown(textarea, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('p')).to.equal(null);

        // Focus should return to the input

        document.activeElement.should.equal(input);
        resolve();
      }, 1);
    });
  });

  it('should close when the popup loses focus', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.blur(textarea);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('p')).to.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should not close when focus moves from the popup to the input', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.blur(textarea, { relatedTarget: input });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        this.container.querySelector('p').should.not.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should call onClose when the popup closes', function test() {
    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onClose={handleClose}>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.keyDown(textarea, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        handlerCalled.should.equal(true);
        resolve();
      }, 1);
    });
  });

  it('should call onKeyDown when a key is depressed in the input', function test() {
    let handlerCalled = false;

    const handleKeyDown = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onKeyDown={handleKeyDown}>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'a' });

    handlerCalled.should.equal(true);
  });

  it('should call onOpen when the popup opens', function test() {
    let handlerCalled = false;

    const handleOpen = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onOpen={handleOpen}>
        <p><textarea /></p>
      </DropdownInput>, this.container,
    );

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    handlerCalled.should.equal(true);
  });
});
