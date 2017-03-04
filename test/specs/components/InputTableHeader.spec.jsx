import React from 'react';
import { render } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import BaseLineInput from '../../../src/components/LineInput';
import InputTableHeader from '../../../src/components/InputTableHeader';
import labelable from '../../../src/enhancers/labelable';

const LineInput = labelable(BaseLineInput);

chai.should();

describe('InputTableHeader', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <InputTableHeader>
        <LineInput label="test" />
      </InputTableHeader>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render the labels of child inputs', function test() {
    render(
      <InputTableHeader>
        <LineInput label="1" />
        <LineInput label="2" />
        <LineInput label="3" />
      </InputTableHeader>, this.container);

    const nodes = this.container.querySelectorAll('label');

    nodes[0].textContent.should.equal('1');
    nodes[1].textContent.should.equal('2');
    nodes[2].textContent.should.equal('3');
  });
});
