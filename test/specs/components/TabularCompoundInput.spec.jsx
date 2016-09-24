import React from 'react';
import { Simulate } from 'react-addons-test-utils';
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

  it('should render as a fieldset', function test() {
    render(<TabularCompoundInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('FIELDSET');
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

  it('should call the onCommit callback when a child input is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const compoundValue = {
      objectNumber: '1-200',
      comment: 'Hello world!',
      group: {
        nested: 'Nested 1',
        deepGroup: {
          deeplyNested: 'Nested 2',
        },
      },
    };

    render(
      <TabularCompoundInput name="compound" value={compoundValue} onCommit={handleCommit}>
        <TextInput name="objectNumber" label="Object number" />
        <TextInput name="comment" multiline label={<Label>Comment</Label>} />
      </TabularCompoundInput>, this.container);

    const input = this.container.querySelectorAll('input')[0];

    input.value = 'New value';

    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['compound', 'objectNumber']);
    committedValue.should.equal('New value');
  });
});
