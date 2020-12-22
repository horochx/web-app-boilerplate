module.exports = api => {
  const isEnvProduction = api.env("production");

  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "usage",
          "corejs": {
            "version": 3,
            "proposals": true,
          },
        },
      ],
      "@babel/preset-react",
    ],
    "plugins": [
      !isEnvProduction ? void 0 : "@babel/plugin-transform-react-constant-elements",
      !isEnvProduction ? "react-refresh/babel" : void 0,
    ].filter(Boolean),
  };
};
