import React from 'react';
import { render } from 'react-dom';
import { createRenderer } from 'react-addons-test-utils';
import FilteringDropdownMenuInput from '../../../src/components/FilteringDropdownMenuInput';
import AuthorityControlledInput from '../../../src/components/AuthorityControlledInput';
import createTestContainer from '../../helpers/createTestContainer';

chai.should();

describe('AuthorityControlledInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a FilteringDropdownMenuInput', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<AuthorityControlledInput authority="" />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(FilteringDropdownMenuInput);
  });

  it('should', function test() {
    render(<AuthorityControlledInput authority="" />, this.container);
  });

  // TODO: Complete tests.
});
