import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import QuickSearchInput from '../../../src/components/QuickSearchInput';
import createTestContainer from '../../helpers/createTestContainer';

chai.should();

const recordTypes = {
  all: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'All Records',
        },
      },
    },
    serviceConfig: {
      serviceType: 'utility',
    },
  },
  object: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'All Objects',
        },
      },
    },
    serviceConfig: {
      serviceType: 'utility',
    },
  },
  procedure: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'All Procedures',
        },
      },
    },
    serviceConfig: {
      serviceType: 'utility',
    },
  },
  authority: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'All Authorities',
        },
      },
    },
    serviceConfig: {
      serviceType: 'utility',
    },
  },
  concept: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Concepts',
        },
      },
    },
    serviceConfig: {
      serviceType: 'authority',
    },
    vocabularies: {
      all: {
        type: 'all',
        messages: {
          name: {
            defaultMessage: 'All',
          },
        },
      },
      concept: {
        messages: {
          name: {
            defaultMessage: 'Associated',
          },
        },
      },
      activity: {
        messages: {
          name: {
            defaultMessage: 'Activity',
          },
        },
      },
      material_ca: {
        messages: {
          name: {
            defaultMessage: 'Material',
          },
        },
      },
    },
  },
  loanin: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Loans In',
        },
      },
    },
    serviceConfig: {
      serviceType: 'procedure',
    },
  },
  media: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Media Handling',
        },
      },
    },
    serviceConfig: {
      serviceType: 'procedure',
    },
  },
  group: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Groups',
        },
      },
    },
    serviceConfig: {
      serviceType: 'procedure',
    },
  },
  collectionobject: {
    defaultForSearch: true,
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Objects',
        },
      },
    },
    serviceConfig: {
      serviceType: 'object',
    },
  },
  person: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Persons',
        },
      },
    },
    serviceConfig: {
      serviceType: 'authority',
    },
    vocabularies: {
      all: {
        type: 'all',
        messages: {
          name: {
            defaultMessage: 'All',
          },
        },
      },
      person: {
        messages: {
          name: {
            defaultMessage: 'Local',
          },
        },
      },
      ulan_pa: {
        messages: {
          name: {
            defaultMessage: 'ULAN',
          },
        },
      },
    },
  },
  organization: {
    messages: {
      record: {
        collectionName: {
          defaultMessage: 'Organizations',
        },
      },
    },
    serviceConfig: {
      serviceType: 'authority',
    },
    vocabularies: {
      all: {
        type: 'all',
        messages: {
          name: {
            defaultMessage: 'All',
          },
        },
      },
      organization: {
        messages: {
          name: {
            defaultMessage: 'Local',
          },
        },
      },
      ulan_oa: {
        messages: {
          name: {
            defaultMessage: 'ULAN',
          },
        },
      },
    },
  },
};

describe('QuickSearchInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render record type options', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(10);
    items[0].textContent.should.equal('All Records');
    items[1].textContent.should.equal('Objects');
    items[2].textContent.should.equal('All Procedures');
    items[3].textContent.should.equal('Groups');
    items[4].textContent.should.equal('Loans In');
    items[5].textContent.should.equal('Media Handling');
    items[6].textContent.should.equal('All Authorities');
    items[7].textContent.should.equal('Concepts');
    items[8].textContent.should.equal('Organizations');
    items[9].textContent.should.equal('Persons');
  });

  it('should display the record type name if a message is not provided', function test() {
    const messages = recordTypes.loanin.messages;

    recordTypes.loanin.messages = null;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[4].textContent.should.equal('loanin');

    recordTypes.loanin.messages = messages;
  });

  it('should render vocabulary options if a record type is selected', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="organization"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(3);
    items[0].textContent.should.equal('All');
    items[1].textContent.should.equal('Local');
    items[2].textContent.should.equal('ULAN');
  });

  it('should display the vocabulary name if a message is not provided', function test() {
    const messages = recordTypes.organization.vocabularies.ulan_oa.messages;

    recordTypes.organization.vocabularies.ulan_oa.messages = null;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="organization"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[2].textContent.should.equal('ulan_oa');

    recordTypes.organization.vocabularies.ulan_oa.messages = messages;
  });

  it('should set the keyword input value from the keywordValue prop', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        keywordValue="some keywords"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value.should.equal('some keywords');
  });

  it('should select the record type indicated by recordTypeValue prop', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="group"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Groups');
  });

  it('should select the record type with defaultForSearch set to true if recordTypeValue is not supplied', function test() {
    recordTypes.collectionobject.defaultForSearch = false;
    recordTypes.media.defaultForSearch = true;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Media Handling');

    recordTypes.object.defaultForSearch = true;
    recordTypes.media.defaultForSearch = false;
  });

  it('should select the first record type option if recordTypeValue is not supplied and no record types have defaultForSearch set to true', function test() {
    recordTypes.object.defaultForSearch = false;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('All Records');

    recordTypes.object.defaultForSearch = true;
  });

  it('should select the vocabulary indicated by vocabularyValue prop', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        vocabularyValue="material_ca"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concepts');
    inputs[1].value.should.equal('Material');
  });

  it('should select the vocabulary with defaultForSearch set to true if vocabularyValue is not supplied', function test() {
    recordTypes.concept.vocabularies.material_ca.defaultForSearch = true;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concepts');
    inputs[1].value.should.equal('Material');

    recordTypes.concept.vocabularies.material_ca.defaultForSearch = false;
  });

  it('should select the first vocabulary option if vocabularyValue is not supplied and no vocabularies have defaultForSearch set to true', function test() {
    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs[0].value.should.equal('Concepts');
    inputs[1].value.should.equal('All');
  });

  it('should not render the vocabulary dropdown if the selected record type is not an authority', function test() {
    render(
      <QuickSearchInput
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
      <QuickSearchInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(10);
    items[0].textContent.should.equal('All Records');
    items[1].textContent.should.equal('Objects');
    items[2].textContent.should.equal('All Procedures');
    items[3].textContent.should.equal('Media Handling');
    items[4].textContent.should.equal('Groups');
    items[5].textContent.should.equal('Loans In');
    items[6].textContent.should.equal('All Authorities');
    items[7].textContent.should.equal('Persons');
    items[8].textContent.should.equal('Concepts');
    items[9].textContent.should.equal('Organizations');

    recordTypes.media.sortOrder = null;
    recordTypes.person.sortOrder = null;
  });

  it('should use sortOrder property of vocabulary config to sort vocabularies', function test() {
    recordTypes.concept.vocabularies.concept.sortOrder = 0;
    recordTypes.concept.vocabularies.material_ca.sortOrder = 1;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items[0].textContent.should.equal('All');
    items[1].textContent.should.equal('Associated');
    items[2].textContent.should.equal('Material');
    items[3].textContent.should.equal('Activity');

    recordTypes.concept.vocabularies.concept.sortOrder = null;
    recordTypes.concept.vocabularies.material_ca.sortOrder = null;
  });

  it('should call onRecordTypeCommit when a record type is selected', function test() {
    let committedValue = null;

    const handleCommit = (value) => {
      committedValue = value;
    };

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        onRecordTypeCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(4));

    committedValue.should.equal('loanin');
  });

  it('should call onVocabularyCommit when a vocabulary is selected', function test() {
    let committedValue = null;

    const handleCommit = (value) => {
      committedValue = value;
    };

    render(
      <QuickSearchInput
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
      <QuickSearchInput
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
      <QuickSearchInput
        recordTypes={recordTypes}
        onSearch={handleSearch}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value = 'some keywords';

    Simulate.keyPress(input, { key: 'Enter' });

    handlerCalled.should.equal(true);
  });

  it('should call formatRecordTypeLabel to format the label for a record type item', function test() {
    const formatRecordTypeLabel = name => `formatRecordTypeLabel ${name}`;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        formatRecordTypeLabel={formatRecordTypeLabel}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(10);
    items[0].textContent.should.equal('formatRecordTypeLabel all');
    items[1].textContent.should.equal('formatRecordTypeLabel collectionobject');
    items[2].textContent.should.equal('formatRecordTypeLabel procedure');
    items[3].textContent.should.equal('formatRecordTypeLabel group');
    items[4].textContent.should.equal('formatRecordTypeLabel loanin');
    items[5].textContent.should.equal('formatRecordTypeLabel media');
    items[6].textContent.should.equal('formatRecordTypeLabel authority');
    items[7].textContent.should.equal('formatRecordTypeLabel concept');
    items[8].textContent.should.equal('formatRecordTypeLabel organization');
    items[9].textContent.should.equal('formatRecordTypeLabel person');
  });

  it('should call formatVocabularyLabel to format the label for a vocabulary item', function test() {
    const formatVocabularyLabel = name => `formatVocabularyLabel ${name}`;

    render(
      <QuickSearchInput
        recordTypes={recordTypes}
        recordTypeValue="concept"
        formatVocabularyLabel={formatVocabularyLabel}
      />, this.container);

    const input = this.container.querySelectorAll('input')[1];

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items[0].textContent.should.equal('formatVocabularyLabel all');
    items[1].textContent.should.equal('formatVocabularyLabel activity');
    items[2].textContent.should.equal('formatVocabularyLabel concept');
    items[3].textContent.should.equal('formatVocabularyLabel material_ca');
  });
});
