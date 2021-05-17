/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    '../external-example/src': { url: '/external' },
  },
  workspaceRoot: '../',
  alias: {
    '@external': '../external-example/src',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-webpack',
    ['snowpack-svgr', { exportUrlAsDefault: true }],
  ],
};
