import React from 'react';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import MiniButton from '../../../src/components/MiniButton';

chai.should();

describe('MiniButton', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a button', function test() {
    render(<MiniButton>Test</MiniButton>, this.container);

    this.container.firstElementChild.nodeName.should.equal('BUTTON');
  });

  it('should render as a div if readOnly is true', function test() {
    render(<MiniButton readOnly>Test</MiniButton>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });
});
