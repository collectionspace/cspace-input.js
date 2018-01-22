/* global window, document */

import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import { isInput } from '../../../src/helpers/inputHelpers';
import FilteringDropdownMenuInput from '../../../src/components/FilteringDropdownMenuInput';

const expect = chai.expect;

chai.should();

describe('FilteringDropdownMenuInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<FilteringDropdownMenuInput />).should.equal(true);
  });

  it('should show the selected option\'s label in the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    this.container.querySelector('input').value.should.equal('Value 2');

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value1"
      />, this.container);

    this.container.querySelector('input').value.should.equal('Value 1');
  });

  it('should open the popup when the input value changes', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.change(input);

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should call onOpen when the popup opens', function test() {
    let handlerCalled = false;

    const handleOpen = () => {
      handlerCalled = true;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value2"
        onOpen={handleOpen}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.change(input);

    handlerCalled.should.equal(true);
  });

  it('should call the filter function when the input value changes', function test() {
    let filterCalledValue = null;

    const filter = (filterByValue) => {
      filterCalledValue = filterByValue;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        filter={filter}
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'hello';

    Simulate.change(input);

    filterCalledValue.should.equal('hello');
  });

  it('should call onCommit when a value is selected in the menu', function test() {
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
      <FilteringDropdownMenuInput
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
      <FilteringDropdownMenuInput
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
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'abc';

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

  it('should not select a disabled option when it is matched by filtering', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'abcd', disabled: true },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'abc';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    })
    .then(() => {
      expect(committedValue).to.equal(null);
    });
  });

  it('should call onClose when the popup is closed', function test() {
    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    const options = [
      { value: 'value1', label: 'abcd' },
      { value: 'value2', label: 'abcde' },
      { value: 'value3', label: 'ab1234' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        onClose={handleClose}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'abcd';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        handlerCalled.should.equal(true);
        resolve();
      }, 1);
    });
  });

  it('should do nothing when enter is depressed in the input and the input value is not a valid option', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
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

  it('should close the popup when close is called', function test() {
    let dropdownMenuInput = null;

    const handleRef = (ref) => {
      dropdownMenuInput = ref;
    };

    const options = [
      { value: 'value1', label: 'abcd' },
      { value: 'value2', label: 'abcde' },
      { value: 'value3', label: 'ab1234' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        ref={handleRef}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    dropdownMenuInput.close();

    return new Promise((resolve) => {
      window.setTimeout(() => {
        this.container.querySelectorAll('li').length.should.equal(0);
        resolve();
      }, 1);
    });
  });

  it('should should allow a blank value to be committed in the input even if there is no blank option, when blankable is true', function test() {
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
      <FilteringDropdownMenuInput
        blankable
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = '';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'Enter' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    })
    .then(() => {
      input.value.should.equal('');
      this.container.querySelectorAll('li').length.should.equal(0);

      committedValue.should.equal('');
    });
  });

  it('should revert to the last value when escape is depressed in the input while filtering', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    input.value.should.equal('Valu');

    Simulate.keyDown(input, { key: 'Escape' });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1);
    })
    .then(() => {
      input.value.should.equal('Value 3');
    });
  });

  it('should revert to the last value when the input loses focus while filtering', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    input.value.should.equal('Valu');

    Simulate.blur(input, { relatedTarget: document.body });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 1);
    })
    .then(() => {
      input.value.should.equal('Value 3');
    });
  });

  it('should set the value when the popup is closed while filtering and the filter value is blank (when there is a blank option)', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const options = [
      { value: '', label: '' },
      { value: 'value1', label: 'abcd' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = '';

    Simulate.change(input);
    Simulate.blur(input, { relatedTarget: document.body });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedValue.should.equal('');

        resolve();
      }, 0);
    });
  });

  it('should set the value when the popup is closed while filtering and the filter value is blank (when blankable is true)', function test() {
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'abcd' },
    ];

    render(
      <FilteringDropdownMenuInput
        blankable
        options={options}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = '';

    Simulate.change(input);
    Simulate.blur(input, { relatedTarget: document.body });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedValue.should.equal('');

        resolve();
      }, 0);
    });
  });

  it('should display a message showing the current number of matching items', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value3"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    this.container.querySelector('header').textContent.should.equal('3 matches found');
  });

  it('should call formatStatusMessage prop to format the filter message', function test() {
    let formatStatusMessageCount = null;

    const formatStatusMessage = (count) => {
      formatStatusMessageCount = count;

      return 'formatStatusMessage called';
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <FilteringDropdownMenuInput
        options={options}
        value="value3"
        formatStatusMessage={formatStatusMessage}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    input.value = 'Valu';

    Simulate.change(input);

    formatStatusMessageCount.should.equal(3);

    this.container.querySelector('header').textContent.should.equal('formatStatusMessage called');
  });
});
