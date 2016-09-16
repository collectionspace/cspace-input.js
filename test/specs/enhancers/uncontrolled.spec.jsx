/* global document */

import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import uncontrolled from '../../../src/enhancers/uncontrolled';

chai.should();

describe('uncontrolled', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should accept a value prop', function test() {
      uncontrolled('input').propTypes.should.include.keys(['value']);
    });

    it('should pass the value prop to the base component as the defaultValue', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = uncontrolled(StubComponent);

      render(<EnhancedComponent value="v" />, this.container);

      propsReceived.should.deep.equal({
        defaultValue: 'v',
      });
    });

    it('should produce an input that responds to keyboard input', function test() {
      const EnhancedComponent = uncontrolled('input');

      render(<EnhancedComponent value="v" />, this.container);

      const input = this.container.querySelector('input');

      input.focus();

      document.execCommand('insertText', false, 'new');

      input.value.should.equal('vnew');
    });
  });
});
