import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import PrefixFilteringDropdownMenuInput from '../../../src/components/PrefixFilteringDropdownMenuInput';

chai.should();

describe('PrefixFilteringDropdownMenuInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<PrefixFilteringDropdownMenuInput />).should.equal(true);
  });

  it('should filter the menu options when the input value changes', function test() {
    const options = [
      { value: 'abcd', label: 'ABCD' },
      { value: 'abc1', label: 'ABC1' },
      { value: 'defg', label: 'DEFG' },
    ];

    render(
      <PrefixFilteringDropdownMenuInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelectorAll('li').length.should.equal(3);

    input.value = 'ABC';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(2);

    input.value = 'ABCD';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(1);

    input.value = '';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(3);

    input.value = 'D';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(1);

    input.value = 'x';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(0);
  });

  it('should not revert the value when enter is pressed', function test() {
    // Reproducing a bug:
    // 1. Type until options filter down to one value, hit enter to select that value.
    // 2. Hit down arrow to reopen the menu, arrow down to a different value, enter to select it.
    // 3. Hit enter again. The value reverts to the previous value.

    const options = [
      { value: 'abcd', label: 'ABCD' },
      { value: 'abc1', label: 'ABC1' },
      { value: 'defg', label: 'DEFG' },
    ];

    render(
      <PrefixFilteringDropdownMenuInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'ABCD';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(1);

    Simulate.keyDown(input, { key: 'Enter' });

    input.value.should.equal('ABCD');

    Simulate.keyDown(input, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    Simulate.keyDown(menu, { key: 'ArrowDown' });

    const item = this.container.querySelector('li.cspace-input-MenuItem--focused');

    Simulate.keyPress(item, { key: 'Enter' });

    input.value.should.equal('ABC1');

    Simulate.keyDown(input, { key: 'Enter' });

    input.value.should.equal('ABC1');
  });

  it('should apply the filter when new options are supplied via props', function test() {
    const options = [
      { value: 'abcd', label: 'ABCD' },
      { value: 'abc1', label: 'ABC1' },
      { value: 'defg', label: 'DEFG' },
    ];

    render(
      <PrefixFilteringDropdownMenuInput
        options={options}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelectorAll('li').length.should.equal(3);

    input.value = 'ABC';
    Simulate.change(input);

    this.container.querySelectorAll('li').length.should.equal(2);

    const newOptions = [
      { value: 'abcd', label: 'ABCD' },
      { value: 'defg', label: 'DEFG' },
      { value: 'hijk', label: 'HIJK' },
    ];

    render(
      <PrefixFilteringDropdownMenuInput
        options={newOptions}
      />, this.container);

    this.container.querySelectorAll('li').length.should.equal(1);
  });

  it('should call onCommit when a value is committed', function test() {
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
      <PrefixFilteringDropdownMenuInput
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

    render(
      <PrefixFilteringDropdownMenuInput
        name="color"
        options={options}
        value="value2"
      />, this.container);

    Simulate.mouseDown(input);

    const newItems = this.container.querySelectorAll('li');

    Simulate.click(newItems.item(1));

    committedValue.should.equal('value3');
  });
});
