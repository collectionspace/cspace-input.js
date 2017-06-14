import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import RecordTypeInput from '../../../src/components/RecordTypeInput';
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

describe('RecordTypeInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render record type options', function test() {
    render(
      <RecordTypeInput
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
      <RecordTypeInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    items[4].textContent.should.equal('loanin');

    recordTypes.loanin.messages = messages;
  });

  it('should select the record type indicated by value prop', function test() {
    render(
      <RecordTypeInput
        recordTypes={recordTypes}
        value="group"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Groups');
  });

  it('should select the record type with defaultForSearch set to true if value is not supplied', function test() {
    recordTypes.collectionobject.defaultForSearch = false;
    recordTypes.media.defaultForSearch = true;

    render(
      <RecordTypeInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Media Handling');

    recordTypes.object.defaultForSearch = true;
    recordTypes.media.defaultForSearch = false;
  });

  it('should select the first record type option if value is not supplied and no record types have defaultForSearch set to true', function test() {
    recordTypes.object.defaultForSearch = false;

    render(
      <RecordTypeInput
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('All Records');

    recordTypes.object.defaultForSearch = true;
  });

  it('should use sortOrder property of record type config to sort record types within service types', function test() {
    recordTypes.media.sortOrder = 0;
    recordTypes.person.sortOrder = 0;

    render(
      <RecordTypeInput
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

  it('should call formatRecordTypeLabel to format the label for a record type item', function test() {
    const formatRecordTypeLabel = name => `formatRecordTypeLabel ${name}`;

    render(
      <RecordTypeInput
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
});
