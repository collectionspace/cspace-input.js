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

  // TODO: Complete tests.

  it('should render a ReadOnlyInput if readOnly is true', function test() {
    const value = 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1489220916785)\'David Bowie\'';

    render(
      <AuthorityControlledInput
        value={value}
        readOnly
      />, this.container);

    const input = this.container.firstElementChild;

    input.className.should.contain('cspace-input-ReadOnlyInput--common');
    input.textContent.should.equal('David Bowie');
  });
});
