/* global document */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import IDGeneratorInput from '../../../src/components/IDGeneratorInput';
import createTestContainer from '../../helpers/createTestContainer';
import isInput from '../../../src/helpers/isInput';

chai.should();

const patterns = [
  {
    name: 'accession',
    type: 'Accession Number',
    sample: '2016.1.1',
  },
  {
    name: 'intake',
    type: 'Intake Number',
    sample: 'IN2016.1.1',
  },
  {
    name: 'loanin',
    type: 'Loan In Number',
    sample: 'LI2016.1.1',
  },
];

describe('IDGeneratorInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<IDGeneratorInput />).should.equal(true);
  });

  it('should call onMount when mounted', function test() {
    let handlerCalled = false;

    const handleMount = () => {
      handlerCalled = true;
    };

    render(
      <IDGeneratorInput
        patterns={patterns}
        onMount={handleMount}
      />, this.container);

    handlerCalled.should.equal(true);
  });

  it('should call onOpen when opened', function test() {
    let openWithPatterns = null;

    const handleOpen = (withPatterns) => {
      openWithPatterns = withPatterns;
    };

    render(
      <IDGeneratorInput
        onOpen={handleOpen}
        patterns={patterns}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    openWithPatterns.should.deep.equal(patterns);
  });

  it('should show a menu containing pattern types and samples when open', function test() {
    render(<IDGeneratorInput patterns={patterns} />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[0].querySelector('div > div:nth-of-type(1)').textContent.should.equal(patterns[0].type);
    items[0].querySelector('div > div:nth-of-type(2)').textContent.should.equal(patterns[0].sample);

    items[1].querySelector('div > div:nth-of-type(1)').textContent.should.equal(patterns[1].type);
    items[1].querySelector('div > div:nth-of-type(2)').textContent.should.equal(patterns[1].sample);

    items[2].querySelector('div > div:nth-of-type(1)').textContent.should.equal(patterns[2].type);
    items[2].querySelector('div > div:nth-of-type(2)').textContent.should.equal(patterns[2].sample);
  });

  it('should use sampleColumnLabel as the header for the sample column', function test() {
    render(
      <IDGeneratorInput
        patterns={patterns}
        sampleColumnLabel="my sample label"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const header = this.container.querySelector('header');

    header.querySelector('div > div:nth-of-type(2)').textContent.should.equal('my sample label');
  });

  it('should use typeColumnLabel as the header for the type column', function test() {
    render(
      <IDGeneratorInput
        patterns={patterns}
        typeColumnLabel="my type label"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const header = this.container.querySelector('header');

    header.querySelector('div > div:nth-of-type(1)').textContent.should.equal('my type label');
  });

  it('should call generateID when a pattern is selected', function test() {
    let generateIDPatternName = null;
    let generateIDPath = null;

    const generateID = (patternName, path) => {
      generateIDPatternName = patternName;
      generateIDPath = path;
    };

    render(
      <IDGeneratorInput
        generateID={generateID}
        patterns={patterns}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items[1]);

    generateIDPatternName.should.equal(patterns[1].name);
    generateIDPath.should.be.an('array');
  });

  it('should focus the menu when focusMenu is called', function test() {
    const component = render(
      <IDGeneratorInput
        patterns={patterns}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const ul = this.container.querySelector('ul');

    ul.should.not.equal(document.activeElement);

    component.focusMenu();

    ul.should.equal(document.activeElement);
  });
});
