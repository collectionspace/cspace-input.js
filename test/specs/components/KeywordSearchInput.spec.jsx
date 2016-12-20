import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import KeywordSearchInput from '../../../src/components/KeywordSearchInput';
import createTestContainer from '../../helpers/createTestContainer';

chai.should();

const recordTypes = {
  concept: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Concept',
      },
    },
    group: 'authority',
    vocabularies: {
      concept: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'Associated Concepts',
          },
        },
      },
      activity: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'Activity Concepts',
          },
        },
      },
      material_ca: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'Material Concepts',
          },
        },
      },
    },
  },
  loanin: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Loan In',
      },
    },
    group: 'procedure',
  },
  media: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Media',
      },
    },
    group: 'procedure',
  },
  group: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Group',
      },
    },
    group: 'procedure',
  },
  object: {
    defaultForSearch: true,
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Object',
      },
    },
    group: 'object',
  },
  person: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Person',
      },
    },
    group: 'authority',
    vocabularies: {
      person: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'Local Persons',
          },
        },
      },
      ulan_pa: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'ULAN Persons',
          },
        },
      },
    },
  },
  organization: {
    messageDescriptors: {
      recordNameTitle: {
        defaultMessage: 'Organization',
      },
    },
    group: 'authority',
    vocabularies: {
      organization: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'Local Organizations',
          },
        },
      },
      ulan_oa: {
        messageDescriptors: {
          vocabNameTitle: {
            defaultMessage: 'ULAN Organizations',
          },
        },
      },
    },
  },
};

describe('KeywordSearchInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render record type options', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(8);
    items[0].textContent.should.equal('All record types');
    items[1].textContent.should.equal('Object');
    items[2].textContent.should.equal('Group');
    items[3].textContent.should.equal('Loan In');
    items[4].textContent.should.equal('Media');
    items[5].textContent.should.equal('Concept');
    items[6].textContent.should.equal('Organization');
    items[7].textContent.should.equal('Person');
  });

  it('should display the record type name if a message is not provided', function test() {
    const messageDescriptors = recordTypes.loanin.messageDescriptors;

    recordTypes.loanin.messageDescriptors = null;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[3].textContent.should.equal('loanin');

    recordTypes.loanin.messageDescriptors = messageDescriptors;
  });

  it('should render vocabulary options if a record type is selected', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="organization"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(3);
    items[0].textContent.should.equal('All vocabularies');
    items[1].textContent.should.equal('Local Organizations');
    items[2].textContent.should.equal('ULAN Organizations');
  });

  it('should display the vocabulary name if a message is not provided', function test() {
    const messageDescriptors = recordTypes.organization.vocabularies.ulan_oa.messageDescriptors;

    recordTypes.organization.vocabularies.ulan_oa.messageDescriptors = null;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="organization"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[2].textContent.should.equal('ulan_oa');

    recordTypes.organization.vocabularies.ulan_oa.messageDescriptors = messageDescriptors;
  });

  it('should use groupOrder prop to order record type groups', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        groupOrder={{
          object: 2,
          procedure: 0,
          authority: 1,
        }}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(8);
    items[0].textContent.should.equal('All record types');
    items[1].textContent.should.equal('Group');
    items[2].textContent.should.equal('Loan In');
    items[3].textContent.should.equal('Media');
    items[4].textContent.should.equal('Concept');
    items[5].textContent.should.equal('Organization');
    items[6].textContent.should.equal('Person');
    items[7].textContent.should.equal('Object');
  });

  it('should sort groups where groupOrder is not set to the end', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        groupOrder={{
          object: 2,
        }}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(8);
    items[0].textContent.should.equal('All record types');
    items[1].textContent.should.equal('Object');
  });

  it('should set the keyword input value from the keywordValue prop', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        keywordValue="some keywords"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value.should.equal('some keywords');
  });

  it('should select the record type indicated by recordTypeValue prop', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="group"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Group');
  });

  it('should select the record type with defaultForSearch set to true if recordTypeValue is not supplied', function test() {
    recordTypes.object.defaultForSearch = false;
    recordTypes.media.defaultForSearch = true;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Media');

    recordTypes.object.defaultForSearch = true;
    recordTypes.media.defaultForSearch = false;
  });

  it('should select the first record type option if recordTypeValue is not supplied and no record types have defaultForSearch set to true', function test() {
    recordTypes.object.defaultForSearch = false;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('All record types');

    recordTypes.object.defaultForSearch = true;
  });

  it('should select the vocabulary indicated by vocabularyValue prop', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        vocabularyValue="material_ca"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concept');
    inputs[1].value.should.equal('Material Concepts');
  });

  it('should select the vocabulary with defaultForSearch set to true if vocabularyValue is not supplied', function test() {
    recordTypes.concept.vocabularies.material_ca.defaultForSearch = true;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concept');
    inputs[1].value.should.equal('Material Concepts');

    recordTypes.concept.vocabularies.material_ca.defaultForSearch = false;
  });

  it('should select the first vocabulary option if vocabularyValue is not supplied and no vocabularies have defaultForSearch set to true', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concept');
    inputs[1].value.should.equal('All vocabularies');
  });

  it('should not render the vocabulary dropdown if the selected record type is not an authority', function test() {
    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="media"
      />, this.container);

    const dropdowns = this.container.querySelectorAll('.cspace-input-DropdownMenuInput--common');

    dropdowns.length.should.equal(1);
  });

  it('should use sortOrder property of record type config to sort record types within groups', function test() {
    recordTypes.media.sortOrder = 0;
    recordTypes.person.sortOrder = 0;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(8);
    items[0].textContent.should.equal('All record types');
    items[1].textContent.should.equal('Object');
    items[2].textContent.should.equal('Media');
    items[3].textContent.should.equal('Group');
    items[4].textContent.should.equal('Loan In');
    items[5].textContent.should.equal('Person');
    items[6].textContent.should.equal('Concept');
    items[7].textContent.should.equal('Organization');

    recordTypes.media.sortOrder = null;
    recordTypes.person.sortOrder = null;
  });

  it('should use sortOrder property of vocabulary config to sort vocabularies', function test() {
    recordTypes.concept.vocabularies.concept.sortOrder = 0;
    recordTypes.concept.vocabularies.material_ca.sortOrder = 1;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items[0].textContent.should.equal('All vocabularies');
    items[1].textContent.should.equal('Associated Concepts');
    items[2].textContent.should.equal('Material Concepts');
    items[3].textContent.should.equal('Activity Concepts');

    recordTypes.concept.vocabularies.concept.sortOrder = null;
    recordTypes.concept.vocabularies.material_ca.sortOrder = null;
  });

  it('should call onRecordTypeCommit when a record type is selected', function test() {
    let committedValue = null;

    const handleCommit = (value) => {
      committedValue = value;
    };

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        onRecordTypeCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(3));

    committedValue.should.equal('loanin');
  });

  it('should call onVocabularyCommit when a vocabulary is selected', function test() {
    let committedValue = null;

    const handleCommit = (value) => {
      committedValue = value;
    };

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        onVocabularyCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(1));

    committedValue.should.equal('activity');
  });

  it('should call onKeywordCommit when the keyword value is committed', function test() {
    let committedValue = null;

    const handleCommit = (value) => {
      committedValue = value;
    };

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        onKeywordCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value = 'some keywords';

    Simulate.keyPress(input, { key: 'Enter' });

    committedValue.should.equal('some keywords');
  });

  it('should call onSearch when enter is pressed in the keyword input', function test() {
    let handlerCalled = false;

    const handleSearch = () => {
      handlerCalled = true;
    };

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        onSearch={handleSearch}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value = 'some keywords';

    Simulate.keyPress(input, { key: 'Enter' });

    handlerCalled.should.equal(true);
  });

  it('should call formatAllRecordTypesLabel to format the label for the all record types item', function test() {
    const formatAllRecordTypesLabel = () =>
      'formatAllRecordTypesLabel called';

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        formatAllRecordTypesLabel={formatAllRecordTypesLabel}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const item = this.container.querySelector('li');

    item.textContent.should.equal('formatAllRecordTypesLabel called');
  });

  it('should call formatAllVocabulariesLabel to format the label for the all vocabularies item', function test() {
    const formatAllVocabulariesLabel = () =>
      'formatAllVocabulariesLabel called';

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        formatAllVocabulariesLabel={formatAllVocabulariesLabel}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const item = this.container.querySelector('li');

    item.textContent.should.equal('formatAllVocabulariesLabel called');
  });

  it('should call formatRecordTypeLabel to format the label for a record type item', function test() {
    const formatRecordTypeLabel = name => `formatRecordTypeLabel ${name}`;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        formatRecordTypeLabel={formatRecordTypeLabel}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(8);
    items[0].textContent.should.equal('All record types');
    items[1].textContent.should.equal('formatRecordTypeLabel object');
    items[2].textContent.should.equal('formatRecordTypeLabel group');
    items[3].textContent.should.equal('formatRecordTypeLabel loanin');
    items[4].textContent.should.equal('formatRecordTypeLabel media');
    items[5].textContent.should.equal('formatRecordTypeLabel concept');
    items[6].textContent.should.equal('formatRecordTypeLabel organization');
    items[7].textContent.should.equal('formatRecordTypeLabel person');
  });

  it('should call formatVocabularyLabel to format the label for a vocabulary item', function test() {
    const formatVocabularyLabel = name => `formatVocabularyLabel ${name}`;

    render(
      <KeywordSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        formatVocabularyLabel={formatVocabularyLabel}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items[0].textContent.should.equal('All vocabularies');
    items[1].textContent.should.equal('formatVocabularyLabel activity');
    items[2].textContent.should.equal('formatVocabularyLabel concept');
    items[3].textContent.should.equal('formatVocabularyLabel material_ca');
  });
});
