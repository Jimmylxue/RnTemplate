module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          '.png',
          '.jpg',
        ],
        alias: {
          '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@api': './src/api',
          '@navigation': './src/navigation',
          '@biz': './src/biz',
          '@hooks': './src/hooks',
          '@screen': './src/screen',
          '@styles': './src/styles',
          '@utils': './src/utils',
          '@store': './src/store',
        },
      },
    ],
  ],
};
