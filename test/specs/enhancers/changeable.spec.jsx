import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import changeable from '../../../src/enhancers/changeable';

chai.should();

describe('changeable', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', () => {
    it('should lift propTypes from the base component', () => {
      const StubComponent = ({
        name,
        value,
      }) => (
        <div>
          {name}
          {value}
        </div>
      );

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      StubComponent.defaultProps = {
        name: '',
        value: '',
      };

      const EnhancedComponent = changeable(StubComponent);

      // eslint-disable-next-line react/forbid-foreign-prop-types
      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should call onChange when the base component changes', function test() {
      const EnhancedComponent = changeable('input');
      let changedToValue = null;

      const handleChange = (value) => {
        changedToValue = value;
      };

      render(<EnhancedComponent onChange={handleChange} value="hello" />, this.container);

      const input = this.container.querySelector('input');
      const newValue = 'new';

      input.value = newValue;

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

    it('should not update the base component value to the changed value when autoSyncValue is false', function test() {
      const EnhancedComponent = changeable('input');

      render(<EnhancedComponent autoSyncValue={false} />, this.container);

      const input = this.container.querySelector('input');
      input.value = 'new';

      Simulate.change(input);

      input.value.should.equal('');
    });
  });
});
