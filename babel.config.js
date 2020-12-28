module.exports = (api) => {
  const isEnvProduction = api.env("production");

  return {
    plugins: [
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      !isEnvProduction
        ? void 0
        : "@babel/plugin-transform-react-constant-elements",
      !isEnvProduction ? "react-refresh/babel" : void 0,
    ].filter(Boolean),

    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: {
            version: 3,
            proposals: true,
          },
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  };
};
