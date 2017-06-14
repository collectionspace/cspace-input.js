import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import changeable from '../../../src/enhancers/changeable';

chai.should();

describe('changeable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = changeable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept onChange and autoSyncValue props', function test() {
      changeable('input').propTypes.should.include.keys(['onChange', 'autoSyncValue']);
    });

    it('should call onChange when the base component changes', function test() {
      const EnhancedComponent = changeable('input');
      let changedToValue = null;

      const handleChange = (value) => {
        changedToValue = value;
      };

      render(<EnhancedComponent onChange={handleChange} value="hello" />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.change(input);

      changedToValue.should.equal(newValue);
    });

    it('should update the base component value when the value prop changes', function test() {
      const EnhancedComponent = changeable('input');

      render(<EnhancedComponent value="hello" />, this.container);

      const input = this.container.querySelector('input');

      input.value.should.equal('hello');

      render(<EnhancedComponent value="new value" />, this.container);

      input.value.should.equal('new value');
    });
  });
});
