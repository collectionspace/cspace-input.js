import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import committable from '../../../src/enhancers/committable';

chai.should();

describe('committable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should accept an onCommit prop', function test() {
      committable('input').propTypes.should.include.keys(['onCommit']);
    });

    it('should call onCommit when the base component loses focus', function test() {
      const EnhancedComponent = committable('input');

      let committedName = null;
      let committedValue = null;

      const handleCommit = (name, value) => {
        committedName = name;
        committedValue = value;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.blur(input);

      committedName.should.equal('input');
      committedValue.should.equal(newValue);
    });

    it('should call onCommit when enter is pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let committedName = null;
      let committedValue = null;

      const handleCommit = (name, value) => {
        committedName = name;
        committedValue = value;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.keyPress(input, { key: 'Enter' });

      committedName.should.equal('input');
      committedValue.should.equal(newValue);
    });

    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = committable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });
  });
});
