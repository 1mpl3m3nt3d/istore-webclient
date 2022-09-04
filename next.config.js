/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: {
      // default is true. It will be disabled when build type is production.
      sourceMap: true,
      // default is 'dev-only'. Options: 'never' | 'dev-only' | 'always'
      autoLabel: 'dev-only',
      // default is '[local]'.
      // Allowed values: `[local]` `[filename]` and `[dirname]`
      // This option only works when autoLabel is set to 'dev-only' or 'always'.
      // It allows you to define the format of the resulting label.
      // The format is defined via string where variable parts are enclosed in square brackets [].
      // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
      labelFormat: '[local]',
    },
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: {
      // Enabled by default in development, disabled in production to reduce file size,
      // setting this will override the default for all environments.
      displayName: true,
      // Enabled by default.
      ssr: true,
      // Enabled by default.
      fileName: true,
      // Empty by default.
      topLevelImportPaths: [],
      // Defaults to ["index"].
      meaninglessFileNames: ['index'],
      // Enabled by default.
      cssProp: true,
      // Empty by default.
      namespace: '',
      // Not supported yet.
      // minify: true,
      // Not supported yet.
      // transpileTemplateLiterals: true,
      // Not supported yet.
      // pure: true,
    },
  },
};

module.exports = nextConfig;
