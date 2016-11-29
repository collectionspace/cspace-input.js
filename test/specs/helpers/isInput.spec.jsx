import React, { PropTypes } from 'react';

import isInput from '../../../src/helpers/isInput';
import { pathPropType } from '../../../src/helpers/pathHelpers';

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

  it('should return false for a component without all of the required propTypes', function test() {
    const Component = () => null;

    Component.propTypes = {
      name: PropTypes.string,
      foo: PropTypes.string,
    };

    isInput(<Component />).should.equal(false);
  });

  it('should return true for a component with all of the required propTypes', function test() {
    const Component = () => null;

    Component.propTypes = {
      name: PropTypes.string,
      parentPath: pathPropType,
      subpath: pathPropType,
      value: PropTypes.string,
    };

    isInput(<Component />).should.equal(true);
  });
});
