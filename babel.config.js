module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Required by react-native-reanimated v4 (its Babel plugin now lives in
  // react-native-worklets). MUST stay last in the plugins list.
  plugins: ['react-native-worklets/plugin'],
};
