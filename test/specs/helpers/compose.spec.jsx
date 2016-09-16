/* eslint-disable no-unused-expressions, react/prop-types */

import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import compose from '../../../src/helpers/compose';

chai.should();

const PlainComponent = () => <div className="plain">Hello world</div>;
const WrapperComponent1 = props => <div className="wrapper1">{props.children}</div>;
const WrapperComponent2 = props => <div className="wrapper2">{props.children}</div>;

const enhancer1 = BaseComponent =>
  () => <WrapperComponent1><BaseComponent /></WrapperComponent1>;

const enhancer2 = BaseComponent =>
  () => <WrapperComponent2><BaseComponent /></WrapperComponent2>;

describe('compose', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('when no enhancers are supplied', function context() {
    it('should return an identity function', function test() {
      compose()(PlainComponent).should.equal(PlainComponent);
    });
  });

  context('when one enhancer is supplied', function context() {
    it('should return the enhancer', function test() {
      compose(enhancer1).should.equal(enhancer1);
      compose(enhancer2).should.equal(enhancer2);
    });
  });

  context('when multiple enhancers are supplied', function context() {
    it('should return a function that applies the enhancers from right to left', function test() {
      const EnhancedComponent = compose(enhancer1, enhancer2)(PlainComponent);

      render(<EnhancedComponent />, this.container);

      const root = this.container.firstElementChild;

      root.className.should.equal('wrapper1');
      root.querySelector('div.wrapper2').should.exist;
      root.querySelector('div.wrapper2').querySelector('div.plain').should.exist;
    });
  });
});
