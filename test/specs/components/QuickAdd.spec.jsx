import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import QuickAdd from '../../../src/components/QuickAdd';

import createTestContainer from '../../helpers/createTestContainer';

chai.should();

describe('QuickAdd', function suite() {
  const recordTypes = {
    person: {
      serviceConfig: {
        name: 'personauthorities',
        vocabularies: {
          person: {
            messageDescriptors: {
              vocabNameTitle: {
                id: 'vocab.personauthorities.person.nameTitle',
                defaultMessage: 'Local Persons',
              },
            },
          },
        },
        quickAddData: () => {},
      },
    },
  };

  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <QuickAdd
        authority="person/person"
        recordTypes={recordTypes}
      />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should call formatVocabName to format the vocabulary name', function test() {
    const formatVocabName = () => 'formatVocabName called';

    render(
      <QuickAdd
        authority="person/person"
        formatVocabName={formatVocabName}
        recordTypes={recordTypes}
      />, this.container);

    this.container.querySelector('button').textContent.should.equal('formatVocabName called');
  });

  it('should render a button for each vocabulary that is configured in the record plugins', function test() {
    render(
      <QuickAdd
        authority="person/person,person/unknown"
        recordTypes={recordTypes}
      />, this.container);

    this.container.querySelectorAll('button').length.should.equal(1);
  });

  it('should call add when an add button is clicked', function test() {
    let funcCalled = false;

    const add = () => {
      funcCalled = true;
    };

    render(
      <QuickAdd
        add={add}
        authority="person/person"
        recordTypes={recordTypes}
      />, this.container);

    Simulate.click(this.container.querySelector('button'));

    funcCalled.should.equal(true);
  });

  // TODO: Add tests.
});
