import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import DateTimeInput from '../../../src/components/DateTimeInput';
import LineInput from '../../../src/components/LineInput';
import { isInput } from '../../../src/helpers/inputHelpers';

chai.should();

describe('DateTimeInput', function suite() {
  it('should be considered an input by isInput()', function test() {
    isInput(<DateTimeInput />).should.equal(true);
  });

  it('should render a read only LineInput', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<DateTimeInput />);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(LineInput);
    result.props.readOnly.should.equal(true);
  });

  it('should use formatValue to format the value', function test() {
    let formatCalled = false;

    const formatValue = (value) => {
      formatCalled = true;

      return `formatted ${value}`;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(<DateTimeInput value="val" formatValue={formatValue} />);

    const result = shallowRenderer.getRenderOutput();

    result.props.value.should.equal('formatted val');

    formatCalled.should.equal(true);
  });
});
