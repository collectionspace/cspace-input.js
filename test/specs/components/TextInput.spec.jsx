import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import isInput from '../../../src/helpers/isInput';
import LineInput from '../../../src/components/LineInput';
import MultilineInput from '../../../src/components/MultilineInput';
import TextInput from '../../../src/components/TextInput';

chai.should();

const renderer = createRenderer();

describe('TextInput', () => {
  it('should be considered an input by isInput()', function test() {
    isInput(<TextInput />).should.equal(true);
  });

  context('when multiline is true', () => {
    it('should always render a MultilineInput', () => {
      renderer.render(<TextInput multiline value={undefined} />);
      renderer.getRenderOutput().type.should.equal(MultilineInput);

      renderer.render(<TextInput multiline value={null} />);
      renderer.getRenderOutput().type.should.equal(MultilineInput);

      renderer.render(<TextInput multiline value="" />);
      renderer.getRenderOutput().type.should.equal(MultilineInput);

      renderer.render(<TextInput multiline value="1" />);
      renderer.getRenderOutput().type.should.equal(MultilineInput);

      renderer.render(<TextInput multiline value={'1\n2'} />);
      renderer.getRenderOutput().type.should.equal(MultilineInput);
    });
  });

  context('when multiline is false', () => {
    it('should always render a LineInput', () => {
      renderer.render(<TextInput multiline={false} value={undefined} />);
      renderer.getRenderOutput().type.should.equal(LineInput);

      renderer.render(<TextInput multiline={false} value={null} />);
      renderer.getRenderOutput().type.should.equal(LineInput);

      renderer.render(<TextInput multiline={false} value="" />);
      renderer.getRenderOutput().type.should.equal(LineInput);

      renderer.render(<TextInput multiline={false} value="1" />);
      renderer.getRenderOutput().type.should.equal(LineInput);

      renderer.render(<TextInput multiline={false} value={'1\n2'} />);
      renderer.getRenderOutput().type.should.equal(LineInput);
    });
  });

  context('when multiline is null', () => {
    context('when value does not contain a newline', () => {
      it('should render a LineInput', () => {
        renderer.render(<TextInput multiline={null} value={undefined} />);
        renderer.getRenderOutput().type.should.equal(LineInput);

        renderer.render(<TextInput multiline={null} value={null} />);
        renderer.getRenderOutput().type.should.equal(LineInput);

        renderer.render(<TextInput multiline={null} value="" />);
        renderer.getRenderOutput().type.should.equal(LineInput);

        renderer.render(<TextInput multiline={null} value="1" />);
        renderer.getRenderOutput().type.should.equal(LineInput);
      });
    });

    context('when value contains a newline', () => {
      it('should render a MultilineInput', () => {
        renderer.render(<TextInput multiline={null} value={'1\n2'} />);
        renderer.getRenderOutput().type.should.equal(MultilineInput);
      });
    });
  });
});
