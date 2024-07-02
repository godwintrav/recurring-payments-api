module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
