
export default {
    moduleFileExtensions: [
      'js',
      'ts',
      'json',
      'vue',
      'tsx',
    ],
    moduleNameMapper: {
      '^@/(.*)$': "<rootDir>/src/$1",
    },
    transform: {
      '^.+\\.tsx$': 'ts-jest',
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.vue$': 'vue-jest'
    },
}