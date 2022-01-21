const { parsed: localEnv } = require("dotenv").config();
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    config.node = { fs: "empty" };
    config.plugins = config.plugins || [];

    config.plugins = [...config.plugins];

    return config;
  },
  env: {
    NEXT_PUBLIC_API_ENDPOINT: "https://meiup-api.herokuapp.com/api/v1",
    NEXT_PUBLIC_KEY_CEP:
      "d7756953-d64d-46a3-8a7f-ffb409dd20a0-38e52cca-6626-41e9-950b-f69496b95a0a",
  },
};
