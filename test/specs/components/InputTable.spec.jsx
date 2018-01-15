import React from 'react';
import { render } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import BaseLineInput from '../../../src/components/LineInput';
import InputTable from '../../../src/components/InputTable';
import labelable from '../../../src/enhancers/labelable';

const LineInput = labelable(BaseLineInput);

chai.should();

describe('InputTable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <InputTable>
        <LineInput name="input1" label="test" />
      </InputTable>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render a header row and an input row', function test() {
    render(
      <InputTable>
        <LineInput name="input1" label="1" />
        <LineInput name="input2" label="2" />
        <LineInput name="input3" label="3" />
      </InputTable>, this.container);

    const header = this.container.querySelector('.cspace-input-InputTableHeader--common');

    header.should.not.equal(null);

    const labels = header.querySelectorAll('label');

    labels.length.should.equal(3);

    labels[0].textContent.should.equal('1');
    labels[1].textContent.should.equal('2');
    labels[2].textContent.should.equal('3');

    const row = this.container.querySelector('.cspace-input-InputTableRow--common');

    row.should.not.equal(null);

    const inputs = row.querySelectorAll('input');

    inputs.length.should.equal(3);

    inputs[0].name.should.equal('input1');
    inputs[1].name.should.equal('input2');
    inputs[2].name.should.equal('input3');
  });

  it('should set the flex style of the label container and input container to the flex prop of the input', function test() {
    render(
      <InputTable>
        <LineInput name="input1" label="1" />
        <LineInput name="input2" label="2" flex="0 0 16px" />
        <LineInput name="input3" label="3" />
      </InputTable>, this.container);

    const header = this.container.querySelector('.cspace-input-InputTableHeader--common');

    header.should.not.equal(null);

    const labelContainers = header.querySelectorAll('div');

    labelContainers[1].style.should.have.property('flex', '0 0 16px');

    const row = this.container.querySelector('.cspace-input-InputTableRow--common');

    row.should.not.equal(null);

    const inputContainers = row.querySelectorAll('div');

    inputContainers[1].style.should.have.property('flex', '0 0 16px');
  });
});
