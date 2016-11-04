/* global document */

import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import Menu from '../../../src/components/Menu';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-input-Menu--common cspace-input-Input--common';

describe('Menu', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a ul', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(<Menu options={options} />, this.container);

    this.container.firstElementChild.nodeName.should.equal('UL');
  });

  it('should render with correct class', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(<Menu options={options} />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should have no rendering if no options are supplied', function test() {
    render(<Menu />, this.container);

    expect(this.container.firstElementChild).to.equal(null);

    render(<Menu options={[]} />, this.container);

    expect(this.container.firstElementChild).to.equal(null);
  });

  it('should render options', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(<Menu options={options} />, this.container);

    const listItems = this.container.firstElementChild.querySelectorAll('li');

    listItems.length.should.equal(3);

    listItems.item(0).textContent.should.equal('Label 1');
    listItems.item(1).textContent.should.equal('Label 2');
    listItems.item(2).textContent.should.equal('Label 3');
  });

  it('should render empty labels as a no break space', function test() {
    const options = [
      ['value1', null],
      ['value2', ''],
      ['value3'],
    ];

    render(<Menu options={options} />, this.container);

    const listItems = this.container.firstElementChild.querySelectorAll('li');

    listItems.item(0).textContent.should.equal(' ');
    listItems.item(1).textContent.should.equal(' ');
    listItems.item(2).textContent.should.equal(' ');
  });

  it('should render the selected option with the correct class', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
      />, this.container);

    const listItems = this.container.firstElementChild.querySelectorAll('li');

    listItems.item(1).className.should.equal('cspace-input-MenuItem--selected');
  });

  it('should focus and select an option when clicked', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
      />, this.container);

    const item3 = this.container.firstElementChild.querySelectorAll('li').item(2);

    Simulate.click(item3);

    item3.className.should.equal('cspace-input-MenuItem--selected cspace-input-MenuItem--focused');
  });

  it('should unfocus all items when losing focus', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
      />, this.container);

    const menu = this.container.firstElementChild;
    const item3 = menu.querySelectorAll('li').item(2);

    Simulate.click(item3);

    item3.className.should.equal('cspace-input-MenuItem--selected cspace-input-MenuItem--focused');

    Simulate.blur(menu);

    item3.className.should.equal('cspace-input-MenuItem--selected');
  });

  it('should focus the selected item when gaining focus', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
      />, this.container);

    const menu = this.container.firstElementChild;
    const item2 = menu.querySelectorAll('li').item(1);

    item2.className.should.equal('cspace-input-MenuItem--selected');

    Simulate.focus(menu);

    item2.className.should.equal('cspace-input-MenuItem--selected cspace-input-MenuItem--focused');
  });

  it('should not propagate mouseDown event on an item', function test() {
    let handlerCalled = false;

    const handleMouseDown = () => {
      handlerCalled = true;
    };

    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <div onMouseDown={handleMouseDown}>
        <Menu
          options={options}
          value="value2"
        />
      </div>, this.container);

    const menu = this.container.firstElementChild;
    const item1 = menu.querySelectorAll('li').item(0);

    Simulate.mouseDown(item1);

    handlerCalled.should.equal(false);
  });

  it('should call onSelect when an option is clicked', function test() {
    let selectedOption = null;

    const handleSelect = (option) => {
      selectedOption = option;
    };

    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
        onSelect={handleSelect}
      />, this.container);

    const item3 = this.container.firstElementChild.querySelectorAll('li').item(2);

    Simulate.click(item3);

    selectedOption.should.deep.equal(['value3', 'Label 3']);
  });

  it('should cycle focus through items when down arrow is depressed', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const menu = this.container.firstElementChild;
    const items = this.container.firstElementChild.querySelectorAll('li');

    Simulate.focus(menu);

    items.item(0).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowDown' });

    items.item(0).className.should.not.match(/focused/);
    items.item(1).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowDown' });

    items.item(1).className.should.not.match(/focused/);
    items.item(2).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowDown' });

    items.item(2).className.should.not.match(/focused/);
    items.item(0).className.should.match(/focused/);
  });

  it('should cycle focus through items when up arrow is depressed', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const menu = this.container.firstElementChild;
    const items = this.container.firstElementChild.querySelectorAll('li');

    Simulate.focus(menu);

    items.item(0).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowUp' });

    items.item(0).className.should.not.match(/focused/);
    items.item(2).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowUp' });

    items.item(2).className.should.not.match(/focused/);
    items.item(1).className.should.match(/focused/);

    Simulate.keyDown(menu, { key: 'ArrowUp' });

    items.item(1).className.should.not.match(/focused/);
    items.item(0).className.should.match(/focused/);
  });

  it('should call onSelect when enter is pressed and an item is focused', function test() {
    let selectedOption = null;

    const handleSelect = (option) => {
      selectedOption = option;
    };

    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
        value="value2"
        onSelect={handleSelect}
      />, this.container);

    const menu = this.container.firstElementChild;

    Simulate.focus(menu);
    Simulate.keyDown(menu, { key: 'ArrowUp' });
    Simulate.keyPress(menu, { key: 'Enter' });

    selectedOption.should.deep.equal(['value1', 'Label 1']);
  });

  it('should become focused when focus() is called', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    const menu = render(<Menu options={options} />, this.container);

    menu.focus();

    const list = this.container.querySelector('ul');

    document.activeElement.should.equal(list);
  });

  it('should update options with new options supplied via props', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const listItems = this.container.firstElementChild.querySelectorAll('li');

    listItems.length.should.equal(3);

    listItems.item(0).textContent.should.equal('Label 1');
    listItems.item(1).textContent.should.equal('Label 2');
    listItems.item(2).textContent.should.equal('Label 3');

    options[1] = ['newvalue', 'New Option Label'];

    render(
      <Menu
        options={options}
      />, this.container);

    const updatedListItems = this.container.firstElementChild.querySelectorAll('li');

    updatedListItems.length.should.equal(3);

    updatedListItems.item(0).textContent.should.equal('Label 1');
    updatedListItems.item(1).textContent.should.equal('New Option Label');
    updatedListItems.item(2).textContent.should.equal('Label 3');
  });

  it('should have max height of 120px', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
      ['value4', 'Label 4'],
      ['value5', 'Label 5'],
      ['value6', 'Label 6'],
      ['value7', 'Label 7'],
      ['value8', 'Label 8'],
      ['value9', 'Label 9'],
      ['value10', 'Label 10'],
      ['value11', 'Label 11'],
      ['value12', 'Label 12'],
      ['value13', 'Label 13'],
      ['value14', 'Label 14'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const list = this.container.querySelector('ul');

    list.getBoundingClientRect().height.should.be.closeTo(120, 0.5);
  });

  it('should scroll the focused item into view when focus is received', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
      ['value4', 'Label 4'],
      ['value5', 'Label 5'],
      ['value6', 'Label 6'],
      ['value7', 'Label 7'],
      ['value8', 'Label 8'],
      ['value9', 'Label 9'],
      ['value10', 'Label 10'],
      ['value11', 'Label 11'],
      ['value12', 'Label 12'],
      ['value13', 'Label 13'],
      ['value14', 'Label 14'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const menu = this.container.firstElementChild;
    const listItems = menu.querySelectorAll('li');
    const item = listItems.item(2);
    const itemOffsetTop = item.getBoundingClientRect().top - menu.getBoundingClientRect().top;

    Simulate.click(item);

    menu.scrollTop = 200;

    Simulate.blur(menu);
    Simulate.focus(menu);

    menu.scrollTop.should.be.closeTo(itemOffsetTop, 0.5);
  });

  it('should scroll the newly focused item into view when up and down arrows are depressed', function test() {
    const options = [
      ['value1', 'Label 1'],
      ['value2', 'Label 2'],
      ['value3', 'Label 3'],
      ['value4', 'Label 4'],
      ['value5', 'Label 5'],
      ['value6', 'Label 6'],
      ['value7', 'Label 7'],
      ['value8', 'Label 8'],
      ['value9', 'Label 9'],
      ['value10', 'Label 10'],
      ['value11', 'Label 11'],
      ['value12', 'Label 12'],
      ['value13', 'Label 13'],
      ['value14', 'Label 14'],
    ];

    render(
      <Menu
        options={options}
      />, this.container);

    const menu = this.container.firstElementChild;

    Simulate.focus(menu);

    for (let i = 0; i < 11; i += 1) {
      Simulate.keyDown(menu, { key: 'ArrowDown' });
    }

    const scrollTop = menu.scrollTop;

    scrollTop.should.be.above(0);

    for (let i = 0; i < 9; i += 1) {
      Simulate.keyDown(menu, { key: 'ArrowUp' });
    }

    menu.scrollTop.should.be.below(scrollTop);
    menu.scrollTop.should.be.above(0);
  });
});
