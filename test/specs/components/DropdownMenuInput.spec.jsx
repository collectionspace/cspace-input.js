/* global window, document */

import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import DropdownMenuInput from '../../../src/components/DropdownMenuInput';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-input-DropdownInput--common cspace-input-DropdownMenuInput--common cspace-input-Input--common';

describe('DropdownMenuInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<DropdownMenuInput />).should.equal(true);
  });

  it('should render as a DropdownInput', function test() {
    render(<DropdownMenuInput />, this.container);

    this.container.firstElementChild.should
      .equal(this.container.querySelector('div.cspace-input-DropdownInput--common'));
  });

  it('should render with correct class', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(<DropdownMenuInput options={options} />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should focus the menu when focusMenu is called', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    const component = render(<DropdownMenuInput options={options} />, this.container);
    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const ul = this.container.querySelector('ul');

    ul.should.not.equal(document.activeElement);

    component.focusMenu();

    ul.should.equal(document.activeElement);
  });

  it('should do nothing if focusMenu is called when the menu is not open', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    const component = render(<DropdownMenuInput options={options} />, this.container);

    component.focusMenu();

    this.container.contains(document.activeElement).should.equal(false);
  });

  it('should show the selected option\'s label in the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 2');
  });

  it('should update the input when a new value is passed via props', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 2');

    render(
      <DropdownMenuInput
        options={options}
        value="value1"
      />, this.container);

    input.value.should.equal('Value 1');
  });

  it('should add a blank option when blankable is true', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        blankable
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items.item(0).textContent.should.equal(' ');
  });

  it('should not add a blank option when blankable is false', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
        blankable={false}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(3);
  });

  it('should use the option value as the label when a label is not supplied', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
        blankable={false}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('value2');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.item(1).textContent.should.equal('value2');
  });

  it('should allow an empty label', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: '' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('');
  });

  it('should display the valueLabel prop in the input when no option has the value', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value99"
        valueLabel="Value 99"
        blankable={false}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 99');
  });

  it('should prefer the option label if a valueLabel prop is supplied, but an option has the value', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
        valueLabel="Some other label"
        blankable={false}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 3');
  });

  it('should open the popup on mouse down on the the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should open the popup when the input value changes', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.change(input);

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should open the popup when the down arrow is depressed', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should close the popup when escape is depressed in the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('li').should.not.equal(null);

    Simulate.keyDown(input, { key: 'Escape' });

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should close the popup when escape is depressed in the popup', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const popup = this.container.querySelector('.cspace-input-Popup--common');

    popup.should.not.equal(null);

    Simulate.focus(popup);
    Simulate.keyDown(popup, { key: 'Escape' });

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should close the popup when a menu item is selected', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
      { value: 'value4', label: 'Value 4' },
      { value: 'value5', label: 'Value 5' },
      { value: 'value6', label: 'Value 6' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(3));

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should update the input value when a menu item is selected', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(3));

    input.value.should.equal('Value 3');
  });

  it('should call onCommit when a menu item is selected', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        name="color"
        options={options}
        value="value2"
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(3));

    committedPath.should.deep.equal(['color']);
    committedValue.should.equal('value3');
  });

  it('should filter the menu options when the input value changes', function test() {
    const options = [
      { value: 'abcd', label: 'ABCD' },
      { value: 'abc1', label: 'ABC1' },
      { value: 'defg', label: 'DEFG' },
    ];

    render(
      <DropdownMenuInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelectorAll('li').length.should.equal(4);

    input.value = 'ABC';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(2);

    input.value = 'ABCD';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(1);

    input.value = '';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(4);

    input.value = 'D';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(1);

    input.value = 'x';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(0);
  });

  it('should set the value and close the popup when enter is depressed in the input and the input value is a valid option', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'abcd' },
      { value: 'value2', label: 'abcde' },
      { value: 'value3', label: 'ab1234' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'abcd';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    })
    .then(() => {
      input.value.should.equal('abcd');
      this.container.querySelectorAll('li').length.should.equal(0);

      committedValue.should.equal('value1');
    });
  });

  it('should set the value and close the popup when enter is depressed in the input and the input value matches only one option', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'abcd' },
      { value: 'value2', label: 'abcde' },
      { value: 'value3', label: 'ab1234' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'ab1';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    })
    .then(() => {
      input.value.should.equal('ab1234');
      this.container.querySelectorAll('li').length.should.equal(0);

      committedValue.should.equal('value3');
    });
  });

  it('should do nothing when enter is depressed in the input and the input value is not a valid option', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    })
    .then(() => {
      input.value.should.equal('Valu');
      this.container.querySelectorAll('li').length.should.equal(3);
    });
  });

  it('should revert to the last value when escape is depressed in the input and the input value is not a valid option', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    input.value.should.equal('Valu');

    Simulate.keyDown(input, { key: 'Escape' });

    input.value.should.equal('Value 3');
  });

  it('should revert to the last value when the input loses focus and the input value is not a valid option', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    input.value.should.equal('Valu');

    Simulate.blur(input, { relatedTarget: document.body });

    input.value.should.equal('Value 3');
  });

  it('should display a message showing the current number of matching items', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    this.container.querySelector('header').textContent.should.equal('3 matches found');
  });

  it('should call formatFilterMessage prop to format the filter message', function test() {
    let formatFilterMessageCount = null;

    const formatFilterMessage = (count) => {
      formatFilterMessageCount = count;

      return 'formatFilterMessage called';
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
        formatFilterMessage={formatFilterMessage}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    formatFilterMessageCount.should.equal(3);

    this.container.querySelector('header').textContent.should.equal('formatFilterMessage called');
  });

  it('should display a loading message when isLoading is true', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        isLoading
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('header').textContent.should.equal('Loading...');
  });

  it('should call formatLoadingMessage prop to format the loading message', function test() {
    let formatLoadingMessageCalled = false;

    const formatLoadingMessage = () => {
      formatLoadingMessageCalled = true;

      return 'formatLoadingMessage called';
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
        formatLoadingMessage={formatLoadingMessage}
        isLoading
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    formatLoadingMessageCalled.should.equal(true);

    this.container.querySelector('header').textContent.should.equal('formatLoadingMessage called');
  });
});
