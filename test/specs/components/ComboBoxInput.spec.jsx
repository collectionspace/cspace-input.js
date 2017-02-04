/* global window, document */

import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import ComboBoxInput from '../../../src/components/ComboBoxInput';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-input-DropdownMenuInput--common cspace-input-Input--common cspace-input-DropdownInput--normal cspace-input-DropdownInput--common';

describe('ComboBoxInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<ComboBoxInput />).should.equal(true);
  });

  it('should render as a DropdownMenuInput', function test() {
    render(<ComboBoxInput />, this.container);

    this.container.firstElementChild.should
      .equal(this.container.querySelector('div.cspace-input-DropdownMenuInput--common'));
  });

  it('should render with correct class', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(<ComboBoxInput options={options} />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should update the input when the value prop changes', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(<ComboBoxInput options={options} value="value1" />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 1');

    render(<ComboBoxInput options={options} value="value3" />, this.container);

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
      <ComboBoxInput
        name="color"
        options={options}
        value="value2"
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(2));

    committedPath.should.deep.equal(['color']);
    committedValue.should.equal('value3');
  });

  it('should call onAddOption when a new option is added', function test() {
    let addedLabel = null;

    const handleAddOption = (label) => {
      addedLabel = label;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        options={options}
        onAddOption={handleAddOption}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'New';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    addedLabel.should.equal('New');
  });

  it('should not call onAddOption when an existing option label is entered', function test() {
    let addedLabel = null;

    const handleAddOption = (label) => {
      addedLabel = label;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        options={options}
        onAddOption={handleAddOption}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Value 2';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    expect(addedLabel).to.equal(null);

    Simulate.keyDown(input, { key: 'Enter' });

    expect(addedLabel).to.equal(null);
  });

  it('should allow a blank option to be added if blankable is true', function test() {
    let addedLabel = null;

    const handleAddOption = (label) => {
      addedLabel = label;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        blankable
        options={options}
        onAddOption={handleAddOption}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = '';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    expect(addedLabel).to.equal('');
  });

  it('should not allow a blank option to be added if blankable is false', function test() {
    let addedLabel = null;

    const handleAddOption = (label) => {
      addedLabel = label;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        blankable={false}
        options={options}
        onAddOption={handleAddOption}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = '';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    expect(addedLabel).to.equal(null);
  });

  it('should close the dropdown when a menu item is selected', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(1));

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(this.container.querySelector('li')).to.equal(null);
        resolve();
      }, 1);
    });
  });

  it('should call onClose when the dropdown is closed', function test() {
    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <ComboBoxInput
        options={options}
        onClose={handleClose}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const popup = this.container.querySelector('.cspace-layout-Popup--common');

    popup.should.not.equal(null);

    Simulate.focus(popup);
    Simulate.keyDown(popup, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        handlerCalled.should.equal(true);
        resolve();
      }, 1);
    });
  });
});
