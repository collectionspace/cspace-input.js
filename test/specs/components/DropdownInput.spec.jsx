/* global document */

import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import DropdownInput from '../../../src/components/DropdownInput';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-input-DropdownInput--common';

describe('DropdownInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
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

  it('should open and close depending on the open prop', function test() {
    render(
      <DropdownInput open>
        <p>content</p>
      </DropdownInput>, this.container);

    this.container.querySelector('p').textContent.should.equal('content');

    render(
      <DropdownInput open={false}>
        <p>content</p>
      </DropdownInput>, this.container);

    expect(this.container.querySelector('p')).to.equal(null);

    render(
      <DropdownInput open>
        <p>content</p>
      </DropdownInput>, this.container);

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should open when clicked', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.click(input);

    this.container.querySelector('p').textContent.should.equal('content');
  });

  it('should open when down arrow is depressed in the input', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container);

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
      </DropdownInput>, this.container);

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
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.click(input);

    this.container.querySelector('p').textContent.should.equal('content');
    focusPopupCalled.should.equal(false);

    Simulate.keyDown(input, { key: 'ArrowDown' });

    focusPopupCalled.should.equal(true);
  });

  it('should close when escape is depressed', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('p').textContent.should.equal('content');

    Simulate.keyDown(input, { key: 'Escape' });

    expect(this.container.querySelector('p')).to.equal(null);
  });

  it('should close when focus is lost', function test() {
    render(
      <DropdownInput>
        <p>content</p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('p').textContent.should.equal('content');

    Simulate.blur(input);

    expect(this.container.querySelector('p')).to.equal(null);
  });

  it('should not close when focus moves from the input to the popup', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.blur(input, { relatedTarget: textarea });

    this.container.querySelector('p').should.not.equal(null);
  });

  it('should close when escape is depressed in the popup', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.keyDown(textarea, { key: 'Escape' });

    expect(this.container.querySelector('p')).to.equal(null);

    // Focus should return to the input

    document.activeElement.should.equal(input);
  });

  it('should close when the popup loses focus', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.blur(textarea);

    expect(this.container.querySelector('p')).to.equal(null);
  });


  it('should not close when focus moves from the popup to the input', function test() {
    render(
      <DropdownInput>
        <p><textarea /></p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.blur(textarea, { relatedTarget: input });

    this.container.querySelector('p').should.not.equal(null);
  });

  it('should call onChange when the input value changes', function test() {
    let changedToValue = null;

    const handleChange = (value) => {
      changedToValue = value;
    };

    render(
      <DropdownInput onChange={handleChange}>
        <p>content</p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');
    const newValue = input.value = 'new';

    Simulate.change(input);

    changedToValue.should.equal(newValue);
  });

  it('should call onClose when the popup closes', function test() {
    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onClose={handleClose}>
        <p><textarea /></p>
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const textarea = this.container.querySelector('textarea');

    textarea.should.not.equal(null);

    Simulate.focus(textarea);
    Simulate.keyDown(textarea, { key: 'Escape' });

    handlerCalled.should.equal(true);
  });

  it('should call onKeyDown when a key is depressed in the input', function test() {
    let handlerCalled = false;

    const handleKeyDown = () => {
      handlerCalled = true;
    };

    render(
      <DropdownInput onKeyDown={handleKeyDown}>
        <p><textarea /></p>
      </DropdownInput>, this.container);

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
      </DropdownInput>, this.container);

    const input = this.container.querySelector('input');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    handlerCalled.should.equal(true);
  });
});
