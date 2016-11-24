import React from 'react';
import { render } from 'react-dom';

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
});
