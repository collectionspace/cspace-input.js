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
    csid: '9dd92952-c384-44dc-a736-95e435c1759c',
    type: 'Accession Number',
    sample: '2016.1.1',
  },
  {
    csid: '8088cfa5-c743-4824-bb4d-fb11b12847f7',
    type: 'Intake Number',
    sample: 'IN2016.1.1',
  },
  {
    csid: 'ed87e7c6-0678-4f42-9d33-f671835586ef',
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
    let generatePatternCsid = null;

    const generateID = (patternCsid) => {
      generatePatternCsid = patternCsid;
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

    generatePatternCsid.should.equal(patterns[1].csid);
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
