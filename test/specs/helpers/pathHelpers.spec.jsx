import { getPath } from '../../../src/helpers/pathHelpers';

chai.should();

describe('pathHelpers', function suite() {
  describe('getPath', function funcSuite() {
    it('should concat the parentPath, subpath, and name', function test() {
      const props = {
        parentPath: 'parentPath',
        subpath: 'subpath',
        name: 'name',
      };

      getPath(props).should.deep.equal(['parentPath', 'subpath', 'name']);
    });

    it('should accept arrays for parentPath and subpath', function test() {
      const props = {
        parentPath: ['parent1', 'parent2'],
        subpath: ['sub1', 'sub2'],
        name: 'name',
      };

      getPath(props).should.deep.equal(
        ['parent1', 'parent2', 'sub1', 'sub2', 'name']
      );
    });

    it('should ignore null/undefined/empty parts', function test() {
      const props = {
        parentPath: null,
        subpath: '',
        name: undefined,
      };

      getPath(props).should.deep.equal([]);
    });

    it('should ignore empty arrays', function test() {
      const props = {
        parentPath: [],
        subpath: 'sub',
        name: 'name',
      };

      getPath(props).should.deep.equal(['sub', 'name']);
    });
  });
});
