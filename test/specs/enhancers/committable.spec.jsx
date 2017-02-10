import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import committable from '../../../src/enhancers/committable';

chai.should();

describe('committable', function suite() {
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

      const EnhancedComponent = committable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept an onCommit prop', function test() {
      committable('input').propTypes.should.include.keys(['onCommit']);
    });

    it('should accept an onBlur prop', function test() {
      committable('input').propTypes.should.include.keys(['onBlur']);
    });

    it('should accept an onKeyPress prop', function test() {
      committable('input').propTypes.should.include.keys(['onKeyPress']);
    });

    it('should accept an commitUnchanged prop', function test() {
      committable('input').propTypes.should.include.keys(['commitUnchanged']);
    });

    it('should call onCommit when the base component loses focus', function test() {
      const EnhancedComponent = committable('input');

      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
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

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });

    it('should call onBlur when the base component loses focus', function test() {
      const EnhancedComponent = committable('input');

      let handlerCalled = false;

      const handleBlur = () => {
        handlerCalled = true;
      };

      render(
        <EnhancedComponent
          name="input"
          onBlur={handleBlur}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');

      Simulate.blur(input);

      handlerCalled.should.equal(true);
    });

    it('should call onCommit when enter is pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
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

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });

    it('should not call onCommit when other keys are pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');

      Simulate.keyPress(input, { key: 'a' });

      handlerCalled.should.equal(false);
    });

    it('should call onKeyPress when a key is pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let pressedKey = null;

      const handleKeyPress = (event) => {
        pressedKey = event.key;
      };

      render(
        <EnhancedComponent
          name="input"
          onKeyPress={handleKeyPress}
        />, this.container);

      const input = this.container.querySelector('input');

      Simulate.keyPress(input, { key: 't' });

      pressedKey.should.equal('t');
    });
    
    describe('when commitUnchanged is false', function test() {
      it('should not call onCommit if the committed value is the same as the initial value', function test() {
        const EnhancedComponent = committable('input');

        let handlerCalled = false;

        const handleCommit = () => {
          handlerCalled = true;
        };

        render(
          <EnhancedComponent
            name="input"
            onCommit={handleCommit}
            onChange={() => {}}
            value="hello"
          />, this.container);

        const input = this.container.querySelector('input');

        Simulate.keyPress(input, { key: 'Enter' });

        handlerCalled.should.equal(false);
      });
    });

    describe('when commitUnchanged is true', function test() {
      it('should call onCommit even if the committed value is the same as the initial value', function test() {
        const EnhancedComponent = committable('input');

        let handlerCalled = false;

        const handleCommit = () => {
          handlerCalled = true;
        };

        render(
          <EnhancedComponent
            commitUnchanged
            name="input"
            onCommit={handleCommit}
            onChange={() => {}}
            value="hello"
          />, this.container);

        const input = this.container.querySelector('input');

        Simulate.keyPress(input, { key: 'Enter' });

        handlerCalled.should.equal(true);
      });
    });
  });
});
