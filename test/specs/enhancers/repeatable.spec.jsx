/* eslint-disable no-unused-expressions */

import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import repeatable from '../../../src/enhancers/repeatable';
import TextInput from '../../../src/components/TextInput';
import RepeatingInput from '../../../src/components/RepeatingInput';

const expect = chai.expect;

chai.should();

describe('repeatable', function suite() {
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

      const EnhancedComponent = repeatable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept repeating and value props', function test() {
      repeatable('input').propTypes.should.include.keys(['repeating', 'value']);
    });

    it('should not pass the repeating prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = repeatable(StubComponent);

      render(<EnhancedComponent foo="f" value="v" repeating />, this.container);

      propsReceived.should.not.include.keys('repeating');
    });

    it('should render a RepeatingInput when repeating is true', function test() {
      const EnhancedComponent = repeatable(TextInput);

      render(<EnhancedComponent value="" repeating />, this.container);

      this.container.querySelector('fieldset').should.exist;
    });

    it('should not render a RepeatingInput when repeating is false', function test() {
      const EnhancedComponent = repeatable(TextInput);

      render(<EnhancedComponent value="" repeating={false} />, this.container);

      expect(this.container.querySelector('fieldset')).to.be.null;
    });

    it('should lift value to the RepeatingInput when repeating is true', function test() {
      const EnhancedComponent = repeatable('input');

      const value = [
        '1',
        '2',
        '3',
      ];

      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent value={value} repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ value });
    });

    it('should lift subpath to the RepeatingInput when repeating is true', function test() {
      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent subpath="schema_name" repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ subpath: 'schema_name' });
    });

    it('should lift name to the RepeatingInput when repeating is true', function test() {
      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent name="rpt" repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ name: 'rpt' });
    });

    it('should lift onCommit to the RepeatingInput when repeating is true', function test() {
      const handleCommit = () => null;

      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent name="rpt" repeating onCommit={handleCommit} />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ onCommit: handleCommit });
    });
  });
});
