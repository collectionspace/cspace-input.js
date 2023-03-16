import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import committable from '../../../src/enhancers/committable';

chai.should();

describe('committable', () => {
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

      const EnhancedComponent = committable(StubComponent);

      // eslint-disable-next-line react/forbid-foreign-prop-types
      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
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
        />, this.container,
      );

      const input = this.container.querySelector('input');
      const newValue = 'new';

      input.value = newValue;

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
        />, this.container,
      );

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
        />, this.container,
      );

      const input = this.container.querySelector('input');
      const newValue = 'new';

      input.value = newValue;

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
        />, this.container,
      );

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
        />, this.container,
      );

      const input = this.container.querySelector('input');

      Simulate.keyPress(input, { key: 't' });

      pressedKey.should.equal('t');
    });

    describe('when commitUnchanged is false', () => {
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
          />, this.container,
        );

        const input = this.container.querySelector('input');

        Simulate.keyPress(input, { key: 'Enter' });

        handlerCalled.should.equal(false);
      });
    });

    describe('when commitUnchanged is true', () => {
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
          />, this.container,
        );

        const input = this.container.querySelector('input');

        Simulate.keyPress(input, { key: 'Enter' });

        handlerCalled.should.equal(true);
      });
    });
  });
});
