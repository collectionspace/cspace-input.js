import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import changeable from '../../../src/enhancers/changeable';

chai.should();

describe('changeable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should accept an onChange prop', function test() {
      changeable('input').propTypes.should.include.keys(['onChange']);
    });

    it('should call onChange when the base component changes', function test() {
      const EnhancedComponent = changeable('input');
      let changedToValue = null;

      const handleChange = (value) => {
        changedToValue = value;
      };

      render(<EnhancedComponent onChange={handleChange} defaultValue="hello" />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.change(input);

      changedToValue.should.equal(newValue);
    });

    it('should lift the static isInput property from the base component', function test() {
      const StubComponent = () => null;
      StubComponent.isInput = true;

      const EnhancedComponent = changeable(StubComponent);
      EnhancedComponent.isInput.should.equal(true);
    });
  });
});
