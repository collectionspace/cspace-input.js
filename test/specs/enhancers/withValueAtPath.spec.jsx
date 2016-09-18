import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import withValueAtPath from '../../../src/enhancers/withValueAtPath';

chai.should();

describe('withValueAtPath', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should accept path prop', function test() {
      withValueAtPath('input').propTypes.should.include.keys(['path']);
    });

    it('should not pass the path prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = withValueAtPath(StubComponent);

      render(<EnhancedComponent name="n" path="p" foo="f" />, this.container);

      propsReceived.should.not.include.keys('path');
    });
  });
});
