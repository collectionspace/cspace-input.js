import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import VocabularyInput from '../../../src/components/VocabularyInput';
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
      disabled_vocab: {
        disabled: true,
        messages: {
          name: {
            defaultMessage: 'Disabled',
          },
        },
      },
    },
  },
};

describe('VocabularyInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render vocabulary options for a given record type', function test() {
    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="organization"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(3);
    items[0].textContent.should.equal('All');
    items[1].textContent.should.equal('Local');
    items[2].textContent.should.equal('ULAN');
  });

  it('should not render options for disabled vocabularies', function test() {
    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="organization"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(3);

    Array.from(items).map(item => item.textContent).should.not.include('Disabled');
  });

  it('should display the vocabulary name if a message is not provided', function test() {
    const messages = recordTypes.organization.vocabularies.ulan_oa.messages;

    recordTypes.organization.vocabularies.ulan_oa.messages = null;

    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="organization"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[2].textContent.should.equal('ulan_oa');

    recordTypes.organization.vocabularies.ulan_oa.messages = messages;
  });

  it('should select the vocabulary indicated by value prop', function test() {
    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="concept"
        value="material_ca"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Material');
  });

  it('should select the vocabulary with defaultForSearch set to true if value is not supplied', function test() {
    recordTypes.concept.vocabularies.material_ca.defaultForSearch = true;

    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="concept"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Material');

    recordTypes.concept.vocabularies.material_ca.defaultForSearch = false;
  });

  it('should select the first vocabulary option if value is not supplied and no vocabularies have defaultForSearch set to true', function test() {
    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="concept"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('All');
  });

  it('should render nothing if the supplied record type is not an authority', function test() {
    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="media"
      />, this.container);

    const dropdowns = this.container.querySelectorAll('.cspace-input-DropdownMenuInput--common');

    dropdowns.length.should.equal(0);
  });

  it('should use sortOrder property of vocabulary config to sort vocabularies', function test() {
    recordTypes.concept.vocabularies.concept.sortOrder = 0;
    recordTypes.concept.vocabularies.material_ca.sortOrder = 1;

    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="concept"
      />, this.container);

    const input = this.container.querySelector('input');

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

  it('should call formatVocabularyLabel to format the label for a vocabulary item', function test() {
    const formatVocabularyLabel = name => `formatVocabularyLabel ${name}`;

    render(
      <VocabularyInput
        recordTypes={recordTypes}
        recordType="concept"
        formatVocabularyLabel={formatVocabularyLabel}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items.length.should.equal(4);
    items[0].textContent.should.equal('formatVocabularyLabel all');
    items[1].textContent.should.equal('formatVocabularyLabel activity');
    items[2].textContent.should.equal('formatVocabularyLabel concept');
    items[3].textContent.should.equal('formatVocabularyLabel material_ca');
  });
});
