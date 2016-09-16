import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import named from '../../../src/enhancers/named';

chai.should();

describe('named', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should accept name and path props', function test() {
      named('input').propTypes.should.include.keys(['name', 'path']);
    });

    it('should not pass the path prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = named(StubComponent);

      render(<EnhancedComponent name="n" path="p" foo="f" />, this.container);

      propsReceived.should.not.include.keys('path');
    });
  });
});
