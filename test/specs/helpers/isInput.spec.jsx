import React, { PropTypes } from 'react';
import chai from 'chai';

import isInput from '../../../src/helpers/isInput';

chai.should();

describe('isInput', function suite() {
  it('should return false for an undefined component', function test() {
    isInput().should.equal(false);
  });

  it('should return false for a null component', function test() {
    isInput(null).should.equal(false);
  });

  it('should return false for a component with no type', function test() {
    isInput('hello').should.equal(false);
  });

  it('should return false for a component with no propTypes', function test() {
    const Component = () => null;

    isInput(<Component />).should.equal(false);
  });

  it('should return false for a component without both name and value propTypes', function test() {
    const Component = () => null;

    Component.propTypes = {
      name: PropTypes.string,
      foo: PropTypes.string,
    };

    isInput(<Component />).should.equal(false);
  });

  it('should return true for a component both name and value propTypes', function test() {
    const Component = () => null;

    Component.propTypes = {
      name: PropTypes.string,
      value: PropTypes.string,
    };

    isInput(<Component />).should.equal(true);
  });
});
