import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import TabularCompoundInput from '../../../src/components/TabularCompoundInput';
import Label from '../../../src/components/Label';
import TextInput from '../../../src/components/TextInput';

chai.should();

describe('TabularCompoundInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<TabularCompoundInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<TabularCompoundInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should distribute values to child inputs', function test() {
    const compoundValue = {
      objectNumber: '1-200',
      comment: 'Hello world!',
    };

    render(
      <TabularCompoundInput value={compoundValue}>
        <TextInput name="objectNumber" label="Object number" />
        <div>
          <TextInput name="comment" multiline label={<Label>Comment</Label>} />
        </div>
      </TabularCompoundInput>, this.container);

    this.container.querySelector('input').value.should.equal(compoundValue.objectNumber);
    this.container.querySelector('textarea').value.should.equal(compoundValue.comment);
  });

  it('should render outer and inner labels', function test() {
    render(
      <TabularCompoundInput label="Compound input label">
        <TextInput name="objectNumber" label="Inner label" />
      </TabularCompoundInput>, this.container);

    const labels = this.container.querySelectorAll('label');

    labels[0].textContent.should.equal('Compound input label');
    labels[1].textContent.should.equal('Inner label');
  });

  it('should render when no labels are supplied', function test() {
    render(
      <TabularCompoundInput>
        <TextInput name="objectNumber" />
      </TabularCompoundInput>, this.container);

    const labels = this.container.querySelectorAll('label');

    labels.length.should.equal(0);
  });
});
