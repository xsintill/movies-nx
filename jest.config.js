const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [...getJestProjects(), '<rootDir>/apps/api', '<rootDir>/libs/core', '<rootDir>/libs/film']
};
