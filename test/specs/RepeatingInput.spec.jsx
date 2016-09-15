import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../helpers/createTestContainer';

import RepeatingInput from '../../src/components/RepeatingInput';
import TextInput from '../../src/components/TextInput';

chai.should();

describe('RepeatingInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <RepeatingInput>
        <div className="template">Repeating input template</div>
      </RepeatingInput>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render the template once for each element in an array value', function test() {
    const repeatingValue = [
      '1',
      '2',
      '3',
    ];

    render(
      <RepeatingInput value={repeatingValue}>
        <div className="template">Repeating input template</div>
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(3);
  });

  it('should render the template once for a string value', function test() {
    render(
      <RepeatingInput value="A string">
        <div className="template">Repeating input template</div>
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for an object value', function test() {
    render(
      <RepeatingInput value={{}}>
        <div className="template">Repeating input template</div>
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for a string value', function test() {
    render(
      <RepeatingInput value="A string">
        <div className="template">Repeating input template</div>
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should distribute values to child inputs', function test() {
    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput value={repeatingValue}>
        <TextInput />
      </RepeatingInput>, this.container);

    this.container.querySelector('input[name="0"]').value.should.equal(repeatingValue[0]);
    this.container.querySelector('input[name="1"]').value.should.equal(repeatingValue[1]);
    this.container.querySelector('input[name="2"]').value.should.equal(repeatingValue[2]);
  });
});

