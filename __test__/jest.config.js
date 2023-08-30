module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)",
  ],
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
