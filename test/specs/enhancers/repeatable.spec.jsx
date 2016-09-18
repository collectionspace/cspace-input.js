/* eslint-disable no-unused-expressions */

import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import repeatable from '../../../src/enhancers/repeatable';
import TextInput from '../../../src/components/TextInput';
import RepeatingInput from '../../../src/components/RepeatingInput';

chai.should();

describe('repeatable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
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

      this.container.querySelector('ol').should.exist;
    });

    it('should lift the value prop to the RepeatingInput', function test() {
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
  });
});
