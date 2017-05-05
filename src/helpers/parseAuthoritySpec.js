export default (authoritySpec) => {
  if (authoritySpec) {
    return authoritySpec.split(',').map((authVocab) => {
      const [
        authorityName,
        vocabularyName,
      ] = authVocab.split('/');

      return {
        authorityName,
        vocabularyName,
      };
    });
  }

  return [];
};
