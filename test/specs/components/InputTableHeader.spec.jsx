import React from 'react';
import { render } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import BaseLineInput from '../../../src/components/LineInput';
import InputTableHeader from '../../../src/components/InputTableHeader';
import labelable from '../../../src/enhancers/labelable';

const LineInput = labelable(BaseLineInput);

const expect = chai.expect;

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

  it('should render nothing if all child input labels are empty', function test() {
    render(
      <InputTableHeader>
        <LineInput label="" />
        <LineInput label={null} />
        <LineInput />
      </InputTableHeader>, this.container);

    expect(this.container.firstElementChild).to.equal(null);
  });

  it('should set the flex style on a label container to the flex prop of the input', function test() {
    render(
      <InputTableHeader>
        <LineInput label="1" />
        <LineInput label="2" flex="0 0 16px" />
        <LineInput label="3" />
      </InputTableHeader>, this.container);

    const nodes = this.container.querySelectorAll('div');

    nodes[2].style.should.have.property('flex', '0 0 16px');
  });

  it('should render a button for fields that are sortable', function test() {
    render(
      <InputTableHeader
        sortableFields={{
          field2: true,
        }}
        onSortButtonClick={() => {}}
      >
        <LineInput name="field1" label="1" />
        <LineInput name="field2" label="2" />
        <LineInput name="field3" label="3" />
      </InputTableHeader>, this.container);

    this.container.querySelector('button[name="field2"]').should.not.equal(null);
  });
});
