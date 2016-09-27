/* eslint-disable react/no-multi-comp, class-methods-use-this */

import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import getPath from '../../../src/helpers/getPath';

chai.should();

describe('getPath', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should return the name when the name prop is set', function test() {
    const StubComponent = props => (
      <span>{getPath(props).join('/')}</span>
    );

    StubComponent.propTypes = {
      name: PropTypes.string,
    };

    render(<StubComponent name="comment" />, this.container);

    this.container.querySelector('span').textContent.should.equal('comment');
  });

  it('should return the subpath and name when both are set', function test() {
    const StubComponent = props => (
      <span>{getPath(props).join('/')}</span>
    );

    StubComponent.propTypes = {
      name: PropTypes.string,
      subpath: PropTypes.arrayOf(PropTypes.string),
    };

    render(
      <StubComponent
        name="comment"
        subpath={['collectionobjects_common']}
      />, this.container);

    this.container.querySelector('span').textContent.should
      .equal('collectionobjects_common/comment');
  });

  it('should get the default subpath from context when subpath is not set', function test() {
    class ContextProvider extends Component {
      getChildContext() {
        return {
          defaultSubpath: ['collectionobjects_common'],
        };
      }

      render() {
        return (
          <div>{this.props.children}</div>
        );
      }
    }

    ContextProvider.propTypes = {
      children: PropTypes.node,
    };

    ContextProvider.childContextTypes = {
      defaultSubpath: PropTypes.arrayOf(PropTypes.string),
    };

    const StubComponent = (props, context) => (
      <span>{getPath(props, context).join('/')}</span>
    );

    StubComponent.propTypes = {
      name: PropTypes.string,
      subpath: PropTypes.arrayOf(PropTypes.string),
    };

    StubComponent.contextTypes = {
      defaultSubpath: PropTypes.arrayOf(PropTypes.string),
    };

    render(
      <ContextProvider>
        <StubComponent name="comment" />
      </ContextProvider>, this.container);

    this.container.querySelector('span').textContent.should
      .equal('collectionobjects_common/comment');
  });

  it('should prepend the parent path from context', function test() {
    class ContextProvider extends Component {
      getChildContext() {
        return {
          defaultSubpath: ['collectionobjects_common'],
          parentPath: ['parent 1', 'parent 2'],
        };
      }

      render() {
        return (
          <div>{this.props.children}</div>
        );
      }
    }

    ContextProvider.propTypes = {
      children: PropTypes.node,
    };

    ContextProvider.childContextTypes = {
      defaultSubpath: PropTypes.arrayOf(PropTypes.string),
      parentPath: PropTypes.arrayOf(PropTypes.string),
    };

    const StubComponent = (props, context) => (
      <span>{getPath(props, context).join('/')}</span>
    );

    StubComponent.propTypes = {
      name: PropTypes.string,
      subpath: PropTypes.arrayOf(PropTypes.string),
    };

    StubComponent.contextTypes = {
      defaultSubpath: PropTypes.arrayOf(PropTypes.string),
      parentPath: PropTypes.arrayOf(PropTypes.string),
    };

    render(
      <ContextProvider>
        <StubComponent name="comment" />
      </ContextProvider>, this.container);

    this.container.querySelector('span').textContent.should
      .equal('parent 1/parent 2/collectionobjects_common/comment');
  });
});
