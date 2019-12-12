import React from 'react';
import PropTypes from 'prop-types';

import { isInput } from '../../../src/helpers/inputHelpers';
import { pathPropType } from '../../../src/helpers/pathHelpers';

chai.should();

describe('isInput', () => {
  it('should return false for an undefined component', () => {
    isInput().should.equal(false);
  });

  it('should return false for a null component', () => {
    isInput(null).should.equal(false);
  });

  it('should return false for a component with no type', () => {
    isInput('hello').should.equal(false);
  });

  it('should return false for a component with no propTypes', () => {
    const Component = () => null;

    isInput(<Component />).should.equal(false);
  });

  it('should return false for a component without all of the required propTypes', () => {
    const Component = () => null;

    Component.propTypes = {
      name: PropTypes.string,
      foo: PropTypes.string,
    };

    isInput(<Component />).should.equal(false);
  });

  it('should return true for a component with all of the required propTypes', () => {
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
